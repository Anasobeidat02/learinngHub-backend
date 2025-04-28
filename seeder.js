
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Question = require('./models/Question');
const Video = require('./models/Video');

// Load env vars
dotenv.config(); 

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data
const adminData = [
  {
    username: 'admin',
    email: 'admin@example.com',
    passwordHash: 'adminpass', // Will be hashed
    role: 'admin',
    createdAt: new Date()
  },
  {
    username: 'superadmin',
    email: 'superadmin@example.com',
    passwordHash: 'superpass', // Will be hashed
    role: 'superadmin',
    createdAt: new Date()
  }
];

const questionData = [
  {
    questionText: 'What is the correct way to declare a variable in JavaScript?',
    choices: [
      { text: 'var x = 10;', isCorrect: false },
      { text: 'let x = 10;', isCorrect: true },
      { text: 'x = 10;', isCorrect: false },
      { text: 'variable x = 10;', isCorrect: false },
    ],
    language: 'JavaScript',
    difficulty: 'easy',
    createdAt: new Date()
  },
  {
    questionText: 'Which Python function is used to get the length of a list?',
    choices: [
      { text: 'size()', isCorrect: false },
      { text: 'length()', isCorrect: false },
      { text: 'len()', isCorrect: true },
      { text: 'count()', isCorrect: false },
    ],
    language: 'Python',
    difficulty: 'easy',
    createdAt: new Date()
  },
  {
    questionText: 'What does CSS stand for?',
    choices: [
      { text: 'Counter Style Sheets', isCorrect: false },
      { text: 'Computer Style Sheets', isCorrect: false },
      { text: 'Creative Style Sheets', isCorrect: false },
      { text: 'Cascading Style Sheets', isCorrect: true },
    ],
    language: 'CSS',
    difficulty: 'easy',
    createdAt: new Date()
  },
  {
    questionText: 'Which operator is used for strict equality comparison in JavaScript?',
    choices: [
      { text: '==', isCorrect: false },
      { text: '===', isCorrect: true },
      { text: '=', isCorrect: false },
      { text: '!=', isCorrect: false },
    ],
    language: 'JavaScript',
    difficulty: 'easy',
    createdAt: new Date()
  },
  {
    questionText: 'How do you create a function in JavaScript?',
    choices: [
      { text: 'function = myFunction()', isCorrect: false },
      { text: 'function:myFunction()', isCorrect: false },
      { text: 'function myFunction()', isCorrect: true },
      { text: 'create myFunction()', isCorrect: false },
    ],
    language: 'JavaScript',
    difficulty: 'easy',
    createdAt: new Date()
  },
  {
    questionText: 'How do you create a comment in Python?',
    choices: [
      { text: '/* comment */', isCorrect: false },
      { text: '// comment', isCorrect: false },
      { text: '# comment', isCorrect: true },
      { text: '<!-- comment -->', isCorrect: false },
    ],
    language: 'Python',
    difficulty: 'easy',
    createdAt: new Date()
  }
];

const videoData = [
  {
    title: 'React Hooks Explained',
    description: 'Learn how to use React hooks with practical examples.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dpw9EHDh2bM',
    thumbnail: 'https://img.youtube.com/vi/dpw9EHDh2bM/maxresdefault.jpg',
    publishedAt: new Date('2023-10-15'),
    tags: ['React', 'Hooks', 'Frontend'],
    category: 'React',
    views: 15000,
    duration: '10:21',
    playlist: 'React Fundamentals',
    content: `
# React Hooks Example Code

\`\`\`jsx
// useState example
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

// useEffect example
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`
    `
  },
  {
    title: 'Node.js API Development',
    description: 'Build RESTful APIs with Node.js and Express',
    youtubeUrl: 'https://www.youtube.com/watch?v=lY6icfhap2o',
    thumbnail: 'https://img.youtube.com/vi/lY6icfhap2o/maxresdefault.jpg',
    publishedAt: new Date('2023-10-20'),
    tags: ['Node.js', 'API', 'Backend'],
    category: 'Backend',
    views: 12000,
    duration: '15:45',
    content: `
# Express API Example

\`\`\`javascript
const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Sample data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// POST new user
app.post('/api/users', (req, res) => {
  const user = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(user);
  res.status(201).json(user);
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
\`\`\`
    `
  },
  {
    title: 'CSS Grid Layout Tutorial',
    description: 'Master CSS Grid with comprehensive examples and techniques.',
    youtubeUrl: 'https://www.youtube.com/watch?v=jV8B24rSN5o',
    thumbnail: 'https://img.youtube.com/vi/jV8B24rSN5o/maxresdefault.jpg',
    publishedAt: new Date('2023-09-05'),
    tags: ['CSS', 'Grid', 'Layout', 'Frontend'],
    category: 'CSS',
    views: 8500,
    duration: '12:30',
    playlist: 'CSS Mastery',
    content: `
# CSS Grid Example

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.item-a {
  grid-column: 1 / 3;
  grid-row: 1;
}

.item-b {
  grid-column: 3;
  grid-row: 1 / 3;
}

.item-c {
  grid-column: 1;
  grid-row: 2;
}

.item-d {
  grid-column: 2;
  grid-row: 2;
}
\`\`\`

## HTML Structure

\`\`\`html
<div class="grid-container">
  <div class="item-a">Item A</div>
  <div class="item-b">Item B</div>
  <div class="item-c">Item C</div>
  <div class="item-d">Item D</div>
</div>
\`\`\`
    `
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await Admin.deleteMany();
    await Question.deleteMany();
    await Video.deleteMany();

    // Create admins with hashed passwords
    const hashedAdmins = await Promise.all(
      adminData.map(async (admin) => {
        const salt = await bcrypt.genSalt(10);
        admin.passwordHash = await bcrypt.hash(admin.passwordHash, salt);
        return admin;
      })
    );

    // Insert admins
    const createdAdmins = await Admin.create(hashedAdmins);
    console.log('Admins imported...');

    // Get superadmin ID
    const superAdminId = createdAdmins.find(admin => admin.role === 'superadmin')._id;
    
    // Add admin reference to questions
    const questionsWithAdmin = questionData.map(question => ({
      ...question,
      createdBy: superAdminId
    }));

    // Create questions
    await Question.create(questionsWithAdmin);
    console.log('Questions imported...');
    
    // Add admin reference to videos
    const videosWithAdmin = videoData.map(video => ({
      ...video,
      createdBy: superAdminId
    }));
    
    // Create videos
    await Video.create(videosWithAdmin);
    console.log('Videos imported...');

    console.log('Data import complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Admin.deleteMany();
    await Question.deleteMany();
    await Video.deleteMany();
    
    console.log('Data destroyed...');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command argument
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
