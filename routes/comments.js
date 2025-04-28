
const express = require('express');
const router = express.Router();

// Example comments data (will be replaced with database queries)
const comments = [
  {
    id: '1',
    videoId: '1',
    user: {
      name: 'محمد أحمد',
      avatar: '/placeholder.svg',
    },
    content: 'شرح رائع جدا، استفدت كثيرا من هذا الفيديو!',
    createdAt: '2023-11-15T08:30:00',
    replies: [
      {
        id: '1-1',
        videoId: '1',
        user: {
          name: 'أنس عبيدات',
          avatar: '/placeholder.svg',
        },
        content: 'شكرا لك! سعيد أنك استفدت من المحتوى.',
        createdAt: '2023-11-15T09:15:00',
      }
    ]
  }
];

// Get comments for a video
router.get('/video/:videoId', (req, res) => {
  const videoComments = comments.filter(c => c.videoId === req.params.videoId);
  res.json(videoComments);
});

// Add a new comment
router.post('/', (req, res) => {
  const { videoId, content } = req.body;
  
  if (!videoId || !content) {
    return res.status(400).json({ error: 'VideoId and content are required' });
  }

  const newComment = {
    id: Date.now().toString(),
    videoId,
    user: {
      name: 'User', // This would be replaced with actual user data
      avatar: '/placeholder.svg',
    },
    content,
    createdAt: new Date().toISOString(),
    replies: []
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

module.exports = router;
