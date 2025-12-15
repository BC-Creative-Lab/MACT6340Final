SELECT role, url, position
FROM project_media
WHERE project_id = (SELECT id FROM projects WHERE slug='satellite-study')
ORDER BY position;


