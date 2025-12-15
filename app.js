import express from "express";
import * as utils from "./utils/utils.js";
import * as db from "./utils/database.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

let projects = [];

const app = express();
app.use(cors());
const port = 3001;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

await db.connect();

app.get("/", async (req, res, next) => {
  try {
    await db.connect();
    const featuredProject = await db.getHomepageFeatured();
    const homeProjects = await db.getHomepageGallery(3);

    res.render("index", { featuredProject, homeProjects });
  } catch (err) {
    next(err);
  }
});


app.get("/projects", async (req, res, next) => {
  try {
    await db.connect();
    const projectArray = await db.getAllPublishedProjects();
    res.render("projects", { projectArray });
  } catch (err) {
    next(err);
  }
});

app.get("/projects/:slug", async (req, res, next) => {
  try {
    await db.connect();
    const project = await db.getProjectBySlug(req.params.slug);

    if (!project) return res.status(404).render("404");

    const viewName = project.is_featured ? "project-featured" : "project";
    res.render(viewName, { project });
  } catch (err) {
    next(err);
  }
});

app.get("/featured", async (req, res, next) => {
  try {
    await db.connect();
    const featuredArray = await db.getFeaturedProjects(12); 
    res.render("featured", { featuredArray });
  } catch (err) {
    next(err);
  }
});


app.get("/about", (req, res) => {
  const aboutImages = [
    "/images/about/Woman1.jpg",
    "/images/about/Woman2.jpg",
    "/images/about/Woman3.jpg",
    "/images/about/Woman4.jpg",
  ];

  const randomImage =
    aboutImages[Math.floor(Math.random() * aboutImages.length)];

  res.render("about", { aboutImage: randomImage });
});


app.get("/contact", (req, res) => {
  res.render("contact");
});

// if no routes matched, show 404 page
app.use((req, res) => {
  res.status(404).render("404");
});

// general error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).render("404");
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


 