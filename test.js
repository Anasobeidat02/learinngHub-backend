const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const Article = require('./models/Article');
const Admin = require('./models/Admin');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
  }
];

// Import article data
const importArticleData = async () => {
  try {
    // Clear existing articles
    await Article.deleteMany();

    // Find superadmin
    const superAdmin = await Admin.findOne({ role: 'superadmin' });
    if (!superAdmin) {
      throw new Error('Superadmin not found. Please run the main seeder first.');
    }

    // Add admin reference and slug to articles
    const articlesWithAdmin = articleData.map(article => {
      let title = article.title;
      if (title === 'C++') title = 'cpp';
      return {
        ...article,
        slug: slugify(title, { lower: true, strict: true }),
        createdBy: superAdmin._id
      };
    });

    // Create articles
    await Article.create(articlesWithAdmin);
    console.log('Articles imported...');

    console.log('Article data import complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete article data
const deleteArticleData = async () => {
  try {
    await Article.deleteMany();
    console.log('Article data destroyed...');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command argument
if (process.argv[2] === '-d') {
  deleteArticleData();
} else {
  importArticleData();
}