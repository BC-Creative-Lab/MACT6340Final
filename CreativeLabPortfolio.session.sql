UPDATE projects SET is_featured = 0;
UPDATE projects SET is_featured = 1, featured_rank = 1
WHERE slug = 'particle-system';


