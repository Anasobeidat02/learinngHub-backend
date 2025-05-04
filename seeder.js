const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Question = require('./models/Question');
const Video = require('./models/Video');
const Article = require('./models/Article');

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

// Sample article data for programming languages
const articleData = [
  {
    title: 'JavaScript',
    description: 'A dynamic programming language that powers the modern web.',
    content: `# JavaScript: The Language of the Web

JavaScript is one of the most popular programming languages in the world. Initially created to make web pages interactive, JavaScript has evolved into a powerful language that can be used for both frontend and backend development.

## History

JavaScript was created by Brendan Eich in just 10 days in May 1995. It was initially called Mocha, then LiveScript, and finally JavaScript - a name chosen to ride on the popularity of Java, despite the two languages having very different syntax and semantics.

## Core Features

* Dynamic typing
* First-class functions
* Prototype-based object-orientation
* Asynchronous event-driven programming
* Closures
* JSON (JavaScript Object Notation)

JavaScript is constantly evolving with new features being added through the ECMAScript standard.`,
    requirements: [
      'Basic understanding of HTML and CSS',
      'Text editor or IDE',
      'Web browser',
      'Patience and determination'
    ],
    useCases: [
      'Web development (frontend)',
      'Server-side development (Node.js)',
      'Mobile app development (React Native, Ionic)',
      'Desktop applications (Electron)',
      'Game development'
    ],
    libraries: [
      {
        name: 'React',
        description: 'A JavaScript library for building user interfaces, particularly single-page applications.',
        url: 'https://reactjs.org'
      },
      {
        name: 'Angular',
        description: 'A platform and framework for building single-page client applications using HTML and TypeScript.',
        url: 'https://angular.io'
      },
      {
        name: 'Vue.js',
        description: 'A progressive framework for building user interfaces that is designed to be incrementally adoptable.',
        url: 'https://vuejs.org'
      },
      {
        name: 'Node.js',
        description: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine for server-side programming.',
        url: 'https://nodejs.org'
      },
      {
        name: 'Express',
        description: 'A minimal and flexible Node.js web application framework that provides robust features for web applications.',
        url: 'https://expressjs.com'
      }
    ],
    language: 'en',
    icon: 'https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png',
    color: 'yellow'
  },
  {
    title: 'Python',
    description: 'A versatile, high-level programming language known for its readability and simplicity.',
    content: `# Python: Simple, Readable, Powerful

Python is a high-level, interpreted programming language known for its emphasis on readability and simplicity. Created by Guido van Rossum and first released in 1991, Python has grown to become one of the most popular programming languages in the world.

## Philosophy

Python's design philosophy emphasizes code readability with its notable use of significant whitespace and clean syntax. Its language constructs aim to help programmers write clear, logical code for both small and large-scale projects.

## Features

* Easy to learn and use
* Interpreted language (no compilation required)
* Dynamically typed
* Object-oriented
* Extensive standard library
* Rich ecosystem of third-party packages
* Cross-platform compatibility

Python's versatility and readability make it an excellent choice for beginners, while its powerful features satisfy the needs of experienced programmers.`,
    requirements: [
      'Basic understanding of programming concepts',
      'Python interpreter',
      'Text editor or IDE',
      'Willingness to learn'
    ],
    useCases: [
      'Web development',
      'Data science and machine learning',
      'Automation and scripting',
      'Scientific computing',
      'Software development',
      'Education'
    ],
    libraries: [
      {
        name: 'Django',
        description: 'A high-level Python web framework that encourages rapid development and clean, pragmatic design.',
        url: 'https://www.djangoproject.com'
      },
      {
        name: 'Flask',
        description: 'A lightweight WSGI web application framework designed to make getting started quick and easy.',
        url: 'https://flask.palletsprojects.com'
      },
      {
        name: 'NumPy',
        description: 'The fundamental package for scientific computing with Python, providing support for arrays, matrices, and mathematical functions.',
        url: 'https://numpy.org'
      },
      {
        name: 'Pandas',
        description: 'Data analysis and manipulation library providing data structures and operations for manipulating numerical tables and time series.',
        url: 'https://pandas.pydata.org'
      },
      {
        name: 'TensorFlow',
        description: 'An end-to-end open source platform for machine learning that has a comprehensive ecosystem of tools.',
        url: 'https://www.tensorflow.org'
      }
    ],
    language: 'en',
    icon: 'https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png',
    color: 'blue'
  },
  {
    title: 'Java',
    description: 'A class-based, object-oriented programming language designed for portability and cross-platform development.',
    content: `# Java: Write Once, Run Anywhere

Java is a class-based, object-oriented programming language that was designed to have as few implementation dependencies as possible. Created by James Gosling at Sun Microsystems, Java was first released in 1995 and has since become one of the world's most popular programming languages.

## Key Principles

Java's design was guided by the principle of "Write Once, Run Anywhere" (WORA), meaning that compiled Java code can run on all platforms that support Java without the need for recompilation.

## Features

* Platform independent
* Object-oriented
* Strongly typed
* Automatic memory management (garbage collection)
* Multi-threaded
* Robust standard library
* High performance
* Security

Java's combination of reliability, portability, and robust ecosystem has made it a mainstay in enterprise software development.`,
    requirements: [
      'Basic understanding of programming concepts',
      'Java Development Kit (JDK)',
      'Integrated Development Environment (IDE)',
      'Understanding of object-oriented programming'
    ],
    useCases: [
      'Enterprise applications',
      'Android app development',
      'Web applications',
      'Cloud applications',
      'Big data technologies',
      'Scientific applications'
    ],
    libraries: [
      {
        name: 'Spring Framework',
        description: 'An application framework and inversion of control container for the Java platform.',
        url: 'https://spring.io'
      },
      {
        name: 'Hibernate',
        description: 'An object-relational mapping framework for the Java language that provides a framework for mapping an object-oriented domain model to a relational database.',
        url: 'https://hibernate.org'
      },
      {
        name: 'Apache Struts',
        description: 'A free, open-source, MVC framework for creating elegant, modern Java web applications.',
        url: 'https://struts.apache.org'
      },
      {
        name: 'JavaFX',
        description: 'A set of graphics and media packages that enables developers to design, create, test, debug, and deploy rich client applications.',
        url: 'https://openjfx.io'
      },
      {
        name: 'Apache Maven',
        description: 'A software project management and comprehension tool based on the concept of a project object model (POM).',
        url: 'https://maven.apache.org'
      }
    ],
    language: 'en',
    icon: 'https://cdn.jsdelivr.net/npm/programming-languages-logos/src/java/java.png',
    color: 'red'
  },
  {
    title: 'C++',
    description: 'A powerful general-purpose programming language with efficient performance and direct hardware control capabilities.',
    content: `# C++: Performance and Control

C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language. First released in 1985, C++ has evolved significantly over the years, with modern C++ offering many features beyond its C heritage.

## Design Goals

C++ was designed with a bias toward system programming and embedded, resource-constrained software and large systems, with performance, efficiency, and flexibility of use as its design highlights.

## Key Features

* Object-oriented programming
* Generic programming
* Low-level memory manipulation
* High performance
* Direct hardware access
* Strong typing
* Multi-paradigm approach
* Rich standard library

C++ bridges the gap between high-level and low-level programming, offering both powerful abstractions and direct control over hardware resources.`,
    requirements: [
      'Understanding of programming fundamentals',
      'C++ compiler (like GCC, Clang, or MSVC)',
      'Text editor or IDE',
      'Patience for complex syntax and concepts'
    ],
    useCases: [
      'System software',
      'Game development',
      'Real-time simulation',
      'High-performance applications',
      'Embedded systems',
      'Resource-constrained environments',
      'Desktop applications'
    ],
    libraries: [
      {
        name: 'Boost',
        description: 'A set of libraries that provide support for tasks and structures such as linear algebra, pseudorandom number generation, multithreading, and more.',
        url: 'https://www.boost.org'
      },
      {
        name: 'Qt',
        description: 'A cross-platform application development framework for desktop, embedded and mobile.',
        url: 'https://www.qt.io'
      },
      {
        name: 'STL (Standard Template Library)',
        description: 'A software library for C++ that provides containers, algorithms, and iterators.',
        url: 'https://en.cppreference.com/w/cpp/container'
      },
      {
        name: 'OpenGL',
        description: 'A cross-language, cross-platform API for rendering 2D and 3D vector graphics.',
        url: 'https://www.opengl.org'
      },
      {
        name: 'Eigen',
        description: 'A C++ template library for linear algebra: matrices, vectors, numerical solvers, and related algorithms.',
        url: 'https://eigen.tuxfamily.org'
      }
    ],
    language: 'en',
    icon: 'https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png',
    color: 'blue'
  },
  {
    title: 'C#',
    description: 'A modern, object-oriented programming language developed by Microsoft for the .NET ecosystem.',
    content: `# C#: Modern and Versatile

C# (pronounced "C-sharp") is a modern, object-oriented programming language developed by Microsoft as part of its .NET initiative. First released in 2000, C# was designed by Anders Hejlsberg and has since evolved through multiple versions, each adding new features and capabilities.

## Design Philosophy

C# was designed to be simple, modern, general-purpose, and object-oriented, while maintaining the expressiveness and elegance of C-style languages. It was intended to provide a balance between rapid development and performance.

## Key Features

* Object-oriented design
* Type safety
* Garbage collection
* Strong typing
* Component-oriented
* Structured exception handling
* Versioning and backward compatibility
* Lambda expressions and LINQ
* Async programming

C# continues to evolve with regular updates, making it a modern language suited for current and future development needs.`,
    requirements: [
      '.NET SDK',
      'Visual Studio or another IDE',
      'Basic understanding of programming concepts',
      'Understanding of object-oriented principles'
    ],
    useCases: [
      'Windows applications',
      'Web applications with ASP.NET',
      'Game development with Unity',
      'Mobile development with Xamarin',
      'Enterprise software',
      'Cloud services with Azure',
      'IoT applications'
    ],
    libraries: [
      {
        name: '.NET Framework',
        description: 'A software framework developed by Microsoft that runs primarily on Microsoft Windows.',
        url: 'https://dotnet.microsoft.com'
      },
      {
        name: 'ASP.NET Core',
        description: 'A cross-platform, high-performance, open-source framework for building modern, cloud-based, Internet-connected applications.',
        url: 'https://dotnet.microsoft.com/apps/aspnet'
      },
      {
        name: 'Entity Framework',
        description: 'An open-source object-relational mapping (ORM) framework for ADO.NET.',
        url: 'https://docs.microsoft.com/en-us/ef/'
      },
      {
        name: 'Unity',
        description: 'A cross-platform game engine used to develop video games for web plugins, desktop platforms, consoles, and mobile devices.',
        url: 'https://unity.com'
      },
      {
        name: 'Xamarin',
        description: 'An open-source platform for building modern and performant applications for iOS, Android, and Windows with .NET.',
        url: 'https://dotnet.microsoft.com/apps/xamarin'
      }
    ],
    language: 'en',
    icon: 'https://cdn.jsdelivr.net/npm/programming-languages-logos/src/csharp/csharp.png',
    color: 'purple'
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await Admin.deleteMany();
    await Question.deleteMany();
    await Video.deleteMany();
    await Article.deleteMany();

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

    // Add admin reference to articles
    const articlesWithAdmin = articleData.map(article => ({
      ...article,
      createdBy: superAdminId
    }));
    
    // Create articles
    await Article.create(articlesWithAdmin);
    console.log('Articles imported...');

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
    await Article.deleteMany();
    
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
