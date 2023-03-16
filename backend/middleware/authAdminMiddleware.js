const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protectAdmin = asyncHandler(async (req, res, next) => {
  // console.log('js.6',req);
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
    ) {
      try {
      // console.log(req.headers,'js.13')
      // Get token from header
      token = req.headers.authorization.split(' ')[1]
      // console.log(token,'js.16')
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SERCET)
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password')
      // console.log(req.user,'js.21');
      if (!req.user) {
        res.status(401)
        throw new Error('Not authorised')
      }
      if(!req.user.isAdmin){
        res.status(401)
        throw new Error('Not authorised')
      }
      
      next()
    } catch (error) {
      res.status(401)
      res.json({
          message: error.message,
          stack: process.env.NODE_ENV === 'production' ? null : error.stack
      })
    }
  }

  if (!token) {
   
    res.status(401)
    throw new Error('Not authorized')
  }
})

module.exports = { protectAdmin }