const express = require('express');
const {getAllProducts, createProducts, updateProducts, deleteProduct, getProductDetails,createProductReview,getProductReviews,deleteReview}  =  require("../controllers/productController")
const router=express.Router();
const isAuthUser = require('../middleware/auth');
const authorizeRoles = require('../middleware/checkRole');


router.route('/products').get(getAllProducts);
router.route('/admin/products/new').post( isAuthUser , authorizeRoles('admin') ,createProducts);
router.route('/admin/products/:id').put( isAuthUser , authorizeRoles('admin') ,updateProducts).delete( isAuthUser , authorizeRoles('admin') ,deleteProduct).get(getProductDetails);
router.route("/reviews").put(isAuthUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthUser, deleteReview);
module.exports= router