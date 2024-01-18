// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.checkRole = (role) => async (req, res, next) => {
  const token = req.header('x-auth-token');
  console.log(token)

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.user.id);

    if (user.role!=role) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
