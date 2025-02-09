const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 🔹 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

// ✅ REGISTER User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // 🔸 Check if user already exists
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    // 🔸 Create new user
    const user = new User({ name, email, password, phone, address });
    await user.save();

    // 🔸 Generate Token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ LOGIN User
exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(400).json({ error: 'Invalid email or password' });
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });
  
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error('Login Error:', error.message);
      res.status(500).json({ error: 'Server error, please try again later.' });
    }
  };
  

// ✅ GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ GET ALL USERS (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
