
const express = require('express');
const router = express.Router();

// Example projects data (will be replaced with database queries)
const projects = [
  {
    id: '1',
    title: 'React E-commerce',
    description: 'A full-featured e-commerce platform built with React',
    image: '/placeholder.svg',
    tags: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/example/react-ecommerce',
    demoUrl: 'https://example.com/demo',
    featured: true
  }
];

// Get all projects
router.get('/', (req, res) => {
  res.json(projects);
});

// Get featured projects
router.get('/featured', (req, res) => {
  const featured = projects.filter(project => project.featured);
  res.json(featured);
});

// Get project by ID
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

module.exports = router;
