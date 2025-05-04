 
const express = require('express');
const cors = require('cors'); 
require('dotenv').config();
const connectDB = require('./db/connection');
const { protect } = require('./middleware/authMiddleware');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
console.log("MONGODB_URI =", process.env.MONGODB_URI);


// Middleware 
// const allowedOrigins = [
//   'https://learinng-hub-fronend.vercel.app', 
//   'http://localhost:8080',
// ];

// app.use(cors({
//   origin: 'https://learinng-hub-fronend.vercel.app',
//   credentials: true
// }));
app.use(cors()); // بدل الـ allowedOrigins

app.use(express.json());
 
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
