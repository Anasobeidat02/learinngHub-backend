const mongoose = require('mongoose');
const slugify = require('slugify');

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String
  }
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  requirements: [String],
  useCases: [String],
  libraries: [librarySchema],
  language: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  color: {
    type: String,
    default: 'blue'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from title before saving
articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;