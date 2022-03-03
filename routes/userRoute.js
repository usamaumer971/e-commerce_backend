const express = require('express');
const {registerUser, loginUser, logoutUser, forgotPassword,getUserDetails,updatePassword,getSingleUser,deleteUser, updateProfile,updateUserRole,getAllUser} = require('../controllers/userController');
const isAuthUser = require('../middleware/auth');
const authorizeRoles = require('../middleware/checkRole');
const router=express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
// router.route("/password/reset/:token").put(resetPassword);
router.route('/logout').get(logoutUser);
router.route("/me").get(isAuthUser, getUserDetails);

router.route("/password/update").put(isAuthUser, updatePassword);

router.route("/me/update").put(isAuthUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthUser, authorizeRoles("admin"), deleteUser);

module.exports= router