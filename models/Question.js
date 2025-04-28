
const mongoose = require('mongoose');

const ChoiceSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  choices: {
    type: [ChoiceSchema],
    validate: [
      {
        validator: function(choices) {
          return choices.length >= 2; // Minimum 2 choices
        },
        message: 'Question must have at least 2 choices'
      },
      {
        validator: function(choices) {
          return choices.some(choice => choice.isCorrect === true); // At least one correct answer
        },
        message: 'Question must have at least one correct answer'
      }
    ]
  },
  language: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
