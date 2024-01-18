// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.registerUser = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract data from request body
  const { username, password, role } = req.body;

  try {
    console.log('Registration Request Data:', { username, password, role });

    // Check if the user already exists
    let user = await User.findOne({ username });
    if (user) {
      console.log('User already exists:', user);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user
    user = new User({ username, password, role });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).send('Server Error');
  }
};

exports.loginUser = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract data from request body
  const { username, password } = req.body;

  try {
    console.log('Login Request Data:', { username, password });

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and send JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, "abc", { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).send('Server Error');
  }
};
