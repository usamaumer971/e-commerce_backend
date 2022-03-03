const mongoose =  require ('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Enter your name"],
        maxLength:[30, "Name cannot exceed 30 character"],
        minLength:[4,"Name should be more than 4 character"]
    },
    email:{
        type:String,
        required: [true, "Enter your email"],
        unique:true,
        validate:[validator.isEmail, "Enter valid email"]  
    },
    password:{
        type:String,
        required:[true,'Enter your password'],
        minLength:[8,"Password should be grater than 8 character"],
        select:false,
    },
    avatar:{
            public_id:{
                type:String,
                require:true
            },
            url:{
                type:String,
                require:true
            }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
});
// Encrypt Password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };
// Compare Password
userSchema.methods.comparePassword = async function(enteredPassword)
{
  return await bcrypt.compare(enteredPassword, this.password)
} 
// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("User", userSchema)