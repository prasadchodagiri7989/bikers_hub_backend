const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// 🔹 Register & Login Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🔹 Protected Routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// 🔹 Admin Routes
router.get('/all-users', protect, isAdmin, getAllUsers);

module.exports = router;
