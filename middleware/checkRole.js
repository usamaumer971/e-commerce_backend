const ErrorHandler = require("../utils/errorhandler");
const catchAsynErrors = require("./catchAsynError");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel') 

authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    };
  };

  module.exports = authorizeRoles