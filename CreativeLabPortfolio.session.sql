SELECT id, role, media_type, url
FROM project_media
WHERE project_id = (
  SELECT id FROM projects WHERE slug = 'particle-system'
);
