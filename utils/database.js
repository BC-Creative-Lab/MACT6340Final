// 1️⃣ Imports + config
import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

let pool;

// 2️⃣ Connection (called once when app starts)
export async function connect() {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    ssl: process.env.MYSQL_SSL === "true"
      ? {
          ca: fs.readFileSync(process.env.MYSQL_CA_CERT),
        }
      : undefined,
  });

  // sanity check
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
}

// 3️⃣ Queries — THIS IS STEP 2
export async function getNewestProjects(limit = 12) {
  const [rows] = await pool.query(
    `
    SELECT
      p.id,
      p.title,
      p.slug,
      p.medium,
      p.format,
      p.created_date,
      m.url AS cover_url
    FROM projects p
    LEFT JOIN project_media m
      ON m.project_id = p.id AND m.role = 'cover'
    WHERE p.is_published = 1
    ORDER BY
      COALESCE(p.created_date, DATE(p.created_at)) DESC,
      p.id DESC
    LIMIT ?
    `,
    [limit]
  );
  return rows;
}

export async function getFeaturedProjects(limit = 3) {
  const [rows] = await pool.query(
    `
    SELECT
      p.id,
      p.title,
      p.slug,
      p.medium,
      p.format,
      p.created_date,
      m.url AS cover_url
    FROM projects p
    LEFT JOIN project_media m
      ON m.project_id = p.id AND m.role = 'cover'
    WHERE p.is_published = 1
      AND p.is_featured = 1
    ORDER BY
      p.featured_rank ASC,
      COALESCE(p.created_date, DATE(p.created_at)) DESC
    LIMIT ?
    `,
    [limit]
  );
  return rows;
}

export async function getProjectBySlug(slug) {
  const [projects] = await pool.query(
    `
    SELECT *
    FROM projects
    WHERE slug = ? AND is_published = 1
    LIMIT 1
    `,
    [slug]
  );

  if (projects.length === 0) return null;

  const project = projects[0];

  const [media] = await pool.query(
    `
    SELECT
      media_type,
      role,
      url,
      alt_text,
      position
    FROM project_media
    WHERE project_id = ?
    ORDER BY
      role = 'cover' DESC,
      position ASC
    `,
    [project.id]
  );

  project.media = media;
  project.cover_url =
    media.find((m) => m.role === "cover")?.url ?? null;

  return project;
}

export async function getHomepageFeatured() {
  const [rows] = await pool.query(`
    SELECT
      p.id, p.title, p.slug, p.description, p.medium, p.format, p.created_date,
      m.url AS cover_url
    FROM projects p
    LEFT JOIN project_media m
      ON m.project_id = p.id AND m.role = 'cover'
    WHERE p.is_published = 1
      AND p.is_featured = 1
    ORDER BY p.featured_rank ASC, COALESCE(p.created_date, DATE(p.created_at)) DESC
    LIMIT 1;
  `);
  return rows[0] ?? null;
}

export async function getHomepageGallery(limit = 3) {
  const [rows] = await pool.query(
    `
    SELECT
      p.id, p.title, p.slug, p.description, p.medium, p.format, p.created_date,
      m.url AS cover_url
    FROM projects p
    LEFT JOIN project_media m
      ON m.project_id = p.id AND m.role = 'cover'
    WHERE p.is_published = 1
      AND p.show_on_home = 1
    ORDER BY p.home_rank ASC, COALESCE(p.created_date, DATE(p.created_at)) DESC
    LIMIT ?;
    `,
    [limit]
  );
  return rows;
}

export async function getAllPublishedProjects() {
  const [rows] = await pool.query(`
    SELECT
      p.id, p.title, p.slug, p.medium, p.format, p.created_date,
      m.url AS cover_url
    FROM projects p
    LEFT JOIN project_media m
      ON m.project_id = p.id AND m.role = 'cover'
    WHERE p.is_published = 1
    ORDER BY COALESCE(p.created_date, DATE(p.created_at)) DESC, p.id DESC;
  `);
  return rows;
}




