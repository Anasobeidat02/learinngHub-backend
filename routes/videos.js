
const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const { protect } = require('../middleware/authMiddleware');

// Get all videos
router.get('/', async (req, res) => {
  try {
    const { category, playlist } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (playlist) {
      query.playlist = playlist;
    }

    const videos = await Video.find(query).sort({ publishedAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured videos (limit to 4)
router.get('/featured', async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ views: -1 })
      .limit(4);
    res.json(videos);
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Increment view count
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected routes below - require admin authentication
// Create new video
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, youtubeUrl, thumbnail, tags, category, playlist, duration, content } = req.body;

    // التحقق من الحقول المطلوبة
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!youtubeUrl) {
      return res.status(400).json({ message: 'YouTube URL is required' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    if (!isValidYoutubeUrl(youtubeUrl)) {
      return res.status(400).json({ message: 'Invalid YouTube URL format' });
    }

    // إنشاء كائن الفيديو
    const newVideo = new Video({
      title,
      description,
      youtubeUrl,
      thumbnail: thumbnail || `https://img.youtube.com/vi/${extractYoutubeId(youtubeUrl)}/maxresdefault.jpg`,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
      category,
      playlist: playlist || null,
      duration: duration || '0:00',
      content: content || '',
      createdBy: req.admin._id,
    });

    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(400).json({ message: 'Invalid video data', error: error.message });
  }
});

// دالة للتحقق من رابط YouTube
function isValidYoutubeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be');
  } catch {
    return false;
  }
}

// Update video
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, youtubeUrl, thumbnail, tags, category, playlist, duration, content } = req.body;
    
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Prepare update data
    const updateData = {
      title: title || video.title,
      description: description || video.description,
      youtubeUrl: youtubeUrl || video.youtubeUrl,
      tags: tags ? (Array.isArray(tags) ? tags.map(tag => tag.trim()) : tags.split(',').map(tag => tag.trim())) : video.tags,
      category: category || video.category,
      playlist: playlist || video.playlist,
      duration: duration || video.duration,
      content: content || video.content
    };
    
    // Update thumbnail if youtubeUrl changed
    if (youtubeUrl && youtubeUrl !== video.youtubeUrl) {
      updateData.thumbnail = thumbnail || `https://img.youtube.com/vi/${extractYoutubeId(youtubeUrl)}/maxresdefault.jpg`;
    } else if (thumbnail) {
      updateData.thumbnail = thumbnail;
    }
    
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(updatedVideo);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(400).json({ message: 'Invalid video data', error: error.message });
  }
});

// Delete video
router.delete('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get videos by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const videos = await Video.find({ 
      category: category === 'All' ? { $exists: true } : category 
    }).sort({ publishedAt: -1 });
    
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos by category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get videos by playlist
router.get('/playlist/:playlist', async (req, res) => {
  try {
    const playlist = req.params.playlist;
    const videos = await Video.find({ playlist }).sort({ publishedAt: -1 });
    
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos by playlist:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all distinct categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Video.distinct('category');
    res.json(['All', ...categories]);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all distinct playlists
router.get('/meta/playlists', async (req, res) => {
  try {
    const playlists = await Video.distinct('playlist');
    // Filter out null values
    res.json(playlists.filter(playlist => playlist));
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to extract YouTube video ID
function extractYoutubeId(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v') || '';
    } else if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.substring(1);
    }
    return '';
  } catch (e) {
    console.error('Error extracting YouTube ID:', e);
    return '';
  }
}

module.exports = router;
