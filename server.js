 
const express = require('express');
const cors = require('cors'); 
require('dotenv').config();
const connectDB = require('./db/connection');
const { protect } = require('./middleware/authMiddleware');
const prerender = require('prerender-node');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
console.log("MONGODB_URI =", process.env.MONGODB_URI);

// Middleware
app.use(cors());
app.use(prerender.set('prerenderToken', process.env.PRERENDER_TOKEN)
  .set('protocol', 'https')
  .set('forwardHeaders', true)
  .set('host', 'www.learnhubjo.com')
  // تعيين وكلاء المستخدم للزواحف بشكل صريح
  .set('crawlerUserAgents', [
    'googlebot',
    'Google-InspectionTool',
    'bingbot',
    'yandex',
    'baiduspider',
    'facebookexternalhit',
    'twitterbot',
    'rogerbot',
    'linkedinbot',
    'embedly',
    'bufferbot',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest',
    'slackbot',
    'vkShare',
    'W3C_Validator'
  ])
);

app.use(express.static(path.join(__dirname, '../frontEnd/dist')));
 
// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/videos', require('./routes/videos'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/admins', require('./routes/admins'));
app.use('/api/articles', require('./routes/articles'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
