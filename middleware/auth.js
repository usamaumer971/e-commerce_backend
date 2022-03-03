const ErrorHandler = require("../utils/errorhandler");
const catchAsynErrors = require("./catchAsynError");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel') 

isAuthUser = catchAsynErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});
module.exports = isAuthUser

