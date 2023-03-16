const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
    ) {
      try {
      // console.log(req.headers)
      // Get token from header
      token = req.headers.authorization.split(' ')[1]
      // console.log(token)
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SERCET)
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password')
      if (!req.user) {
        res.status(401)
        throw new Error('Not authorised-3')
      }
      
      next()
    } catch (error) {
      // console.log(req.headers)
      // console.log(error)
      res.status(401)
      throw new Error('Not authorized-2')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized-1')
  }
})

module.exports = { protect }