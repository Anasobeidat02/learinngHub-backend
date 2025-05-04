const express = require('express');
   const router = express.Router();
   const Article = require('../models/Article');
   const { protect } = require('../middleware/authMiddleware');
   const slugify = require('slugify');

   // @desc    Get all articles
   // @route   GET /api/articles
   // @access  Public
   router.get('/', async (req, res) => {
     try {
       const articles = await Article.find({}).sort({ createdAt: -1 });
       res.json(articles);
     } catch (error) {
       console.error('Error fetching articles:', error);
       res.status(500).json({ message: 'Server error' });
     }
   });

   // @desc    Get article by slug
   // @route   GET /api/articles/:slug
   // @access  Public
   router.get('/:slug', async (req, res) => {
     try {
       const article = await Article.findOne({ slug: req.params.slug });
       
       if (!article) {
         return res.status(404).json({ message: 'Article not found' });
       }
       
       res.json(article);
     } catch (error) {
       console.error('Error fetching article:', error);
       res.status(500).json({ message: 'Server error' });
     }
   });

   // @desc    Create new article
   // @route   POST /api/articles
   // @access  Private/Admin
   router.post('/', protect, async (req, res) => {
     try {
       const { title, description, content, requirements, useCases, libraries, language, icon, color } = req.body;

       // Validate required fields
       if (!title) {
         return res.status(400).json({ message: 'Title is required' });
       }

       // Generate slug from title
       let slugTitle = title;
       if (title === 'C++') slugTitle = 'cpp';
       const slug = slugify(slugTitle, { lower: true, strict: true });

       const article = new Article({
         title,
         description,
         content,
         requirements: Array.isArray(requirements) ? requirements : requirements.split(',').map(req => req.trim()),
         useCases: Array.isArray(useCases) ? useCases : useCases.split(',').map(use => use.trim()),
         libraries,
         language,
         icon,
         color,
         slug, // Add the generated slug
         createdBy: req.admin.id
       });
       
       const savedArticle = await article.save();
       res.status(201).json(savedArticle);
       console.log('Admin creating article:', req.admin);

     } catch (error) {
       console.error('Error creating article:', error);
       res.status(500).json({ message: 'Server error', error: error.message });
     }
   });

   // @desc    Update article
   // @route   PUT /api/articles/:id
   // @access  Private/Admin
   router.put('/:id', protect, async (req, res) => {
     try {
       const { title, description, content, requirements, useCases, libraries, language, icon, color } = req.body;
       
       const article = await Article.findById(req.params.id);
       
       if (!article) {
         return res.status(404).json({ message: 'Article not found' });
       }
       
       // Update slug if title is changed
       if (title && title !== article.title) {
         let slugTitle = title;
         if (title === 'C++') slugTitle = 'cpp';
         article.slug = slugify(slugTitle, { lower: true, strict: true });
       }

       article.title = title || article.title;
       article.description = description || article.description;
       article.content = content || article.content;
       article.requirements = Array.isArray(requirements) ? requirements : requirements.split(',').map(req => req.trim());
       article.useCases = Array.isArray(useCases) ? useCases : useCases.split(',').map(use => use.trim());
       article.libraries = libraries || article.libraries;
       article.language = language || article.language;
       article.icon = icon || article.icon;
       article.color = color || article.color;
       article.updatedAt = Date.now();
       
       const updatedArticle = await article.save();
       res.json(updatedArticle);
     } catch (error) {
       console.error('Error updating article:', error);
       res.status(500).json({ message: 'Server error', error: error.message });
     }
   });

   // @desc    Delete article
   // @route   DELETE /api/articles/:id
   // @access  Private/Admin
   router.delete('/:id', protect, async (req, res) => {
     try {
       const article = await Article.findById(req.params.id);
       
       if (!article) {
         return res.status(404).json({ message: 'Article not found' });
       }
       
       await article.deleteOne();
       res.json({ message: 'Article removed' });
     } catch (error) {
       console.error('Error deleting article:', error);
       res.status(500).json({ message: 'Server error' });
     }
   });

   module.exports = router;