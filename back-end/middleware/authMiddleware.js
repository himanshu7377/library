// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.checkRole = (role) => async (req, res, next) => {
  // const token = localStorage.getItem('token')
  const token = req.header('x-auth-token');
  // console.log(token)

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied  from the middleware' });
  }

  try {
    // console.log("running")
    const decoded = jwt.verify(token,"secret");
    // console.log(decoded)

    const user = await User.findById(decoded.user.id);

    
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ msg: 'Invalid token' });
  }
};
