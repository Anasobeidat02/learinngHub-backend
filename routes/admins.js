const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Question = require('../models/Question'); // افترض أن لديك موديل لـ questions
const Video = require('../models/Video'); // افترض أن لديك موديل لـ videos
const jwt = require('jsonwebtoken');
const { protect, superAdmin } = require('../middleware/authMiddleware');

// Create default admin if none exists
const createDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('No admin found, creating default admin...');
      
      const defaultAdmin = new Admin({
        username: 'admin',
        email: 'admin@example.com',
        passwordHash: 'adminpass', // Will be hashed by pre-save hook
        role: 'superadmin'
      });
      
      await defaultAdmin.save();
      console.log('Default admin created:', defaultAdmin.email);
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Create additional admin for testing
const createAnasAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'anas@gmail.com' });
    if (!existingAdmin) {
      console.log('Creating anas admin account...');
      
      const anasAdmin = new Admin({
        username: 'anas',
        email: 'anas@gmail.com',
        passwordHash: 'anas@1234', // Will be hashed by pre-save hook
        role: 'superadmin'
      });
      
      await anasAdmin.save();
      console.log('Anas admin created:', anasAdmin.email);
    }
  } catch (error) {
    console.error('Error creating anas admin:', error);
  }
};

// Call these functions when the server starts
createDefaultAdmin();
createAnasAdmin();

// Get all admins (superadmin only)
router.get('/', protect, superAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select('-passwordHash');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register a new admin (superadmin only)
router.post('/', protect, superAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    admin = new Admin({
      username,
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      role: role || 'admin'
    });

    await admin.save();
    res.status(201).json({ 
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      } 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', email); // Debug log

    // Check for admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('Admin not found:', email); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    console.log('Password match:', isMatch); // Debug log
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    // Create JWT with a strong secret
    const jwtSecret = process.env.JWT_SECRET || 'H8j3nF9kL2p5R7tY6xV1zAqW3sE8dC4g'; // Much stronger default
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      jwtSecret,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get admin profile
router.get('/profile', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-passwordHash');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update admin
router.put('/:id', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Ensure only superadmins can update other admin roles
    // or admins can only update their own profile
    if (
      (req.admin.role !== 'superadmin' && req.params.id !== req.admin.id) ||
      (req.admin.role !== 'superadmin' && req.body.role)
    ) {
      return res.status(403).json({ message: 'Not authorized to update this admin' });
    }

    // Update fields
    if (req.body.username) admin.username = req.body.username;
    if (req.body.email) admin.email = req.body.email;
    if (req.body.role && req.admin.role === 'superadmin') admin.role = req.body.role;
    
    // Only update password if provided
    if (req.body.password) {
      admin.passwordHash = req.body.password; // Will be hashed by pre-save hook
    }

    const updatedAdmin = await admin.save();
    res.json({
      message: 'Admin updated successfully',
      admin: {
        id: updatedAdmin._id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        role: updatedAdmin.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete admin
router.delete('/:id', protect, superAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Prevent deleting your own account
    if (req.admin.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await admin.deleteOne(); // Using deleteOne instead of deprecated remove()
    res.json({ message: 'Admin removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint لجلب الإحصائيات
router.get('/stats', async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalVideos = await Video.countDocuments();

    res.json({
      totalAdmins,
      totalQuestions,
      totalVideos,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
