const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      joinDate: user.joinDate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    
    // Build update object
    const updateFields = {};
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    );
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      joinDate: user.joinDate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:username
// @desc    Get user profile by username
// @access  Public
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      joinDate: user.joinDate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;