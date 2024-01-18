// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.checkRole = (role) => async (req, res, next) => {
  // const token = localStorage.getItem('token')
  const token = req.header('x-auth-token');
  console.log(token)

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied  from the middleware' });
  }

  try {
    console.log("running")
    const decoded = jwt.verify(token, "abc");
    console.log(decoded)

    const user = await User.findById(decoded.user.id);

    // if (user.role!=role) {
    //   return res.status(403).json({ msg: 'Unauthorized' });
    // }

    req.user = decoded.user;
    console.log(decoded)
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
