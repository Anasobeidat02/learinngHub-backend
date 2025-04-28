
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  youtubeUrl: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true
  },
  playlist: {
    type: String,
    default: null
  },
  duration: {
    type: String,
    default: "0:00"
  },
  views: {
    type: Number,
    default: 0
  },
  content: {
    type: String,
    default: ""
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

// Virtual for extracting YouTube video ID
videoSchema.virtual('videoId').get(function() {
  try {
    const url = new URL(this.youtubeUrl);
    if (url.hostname.includes('youtube.com')) {
      return url.searchParams.get('v');
    } else if (url.hostname.includes('youtu.be')) {
      return url.pathname.substring(1);
    }
    return null;
  } catch (e) {
    return null;
  }
});

// Transform method to convert _id to id for frontend compatibility
videoSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
