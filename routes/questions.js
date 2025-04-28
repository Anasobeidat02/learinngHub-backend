
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { protect, superAdmin } = require('../middleware/authMiddleware');

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get questions by language
router.get('/language/:language', async (req, res) => {
  try {
    const questions = await Question.find({ 
      language: req.params.language 
    })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'username');
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all unique languages
router.get('/languages', async (req, res) => {
  try {
    const languages = await Question.distinct('language');
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get questions by difficulty
router.get('/difficulty/:difficulty', async (req, res) => {
  try {
    const questions = await Question.find({ 
      difficulty: req.params.difficulty 
    })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'username');
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('createdBy', 'username');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a question (protected route)
router.post('/', protect, async (req, res) => {
  try {
    const question = new Question({
      questionText: req.body.questionText,
      choices: req.body.choices,
      language: req.body.language,
      difficulty: req.body.difficulty,
      createdBy: req.admin._id
    });

    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a question (protected route)
router.put('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if admin owns the question or is superadmin
    if (question.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to update this question' });
    }

    question.questionText = req.body.questionText || question.questionText;
    question.choices = req.body.choices || question.choices;
    question.language = req.body.language || question.language;
    question.difficulty = req.body.difficulty || question.difficulty;

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a question (protected route)
router.delete('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if admin owns the question or is superadmin
    if (question.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    await question.deleteOne();
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
