const Products= require ('../models/productsmodel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require ('../middleware/catchAsynError');
const ApiFeatures = require('../utils/apifeature') ;


// Create product -Admin 
exports.createProducts = catchAsyncErrors(
    async (req , res , next)=>{
        req.body.user = req.user.id;
        const product = await Products.create(req.body);
        res.status(200).json({
            success : true, 
            product
        })
    }
);

// Get All Products
exports.getAllProducts = catchAsyncErrors(
    
    async (req,res)=>{
        const resultPerPage = 8;
        const productCount = await Products.countDocuments();
        const apiFeature = new  ApiFeatures(Products.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
        
        const product= await apiFeature.query;
        res.status(200).json({
            success : true, 
            productCount ,
            product
            
        })
    }
);
// Get Products Details
exports.getProductDetails = catchAsyncErrors(
    async (req,res, next)=>{

        const id = req.params.id;
        const product = await Products.findByIdAndUpdate(id);
    
        if(!product){
            return next(new ErrorHandler("Product Not Found",404))
        }
       res.status(200).json({
           success:true,
           product
       })
    }
);


// Update Products - Admin

exports.updateProducts = catchAsyncErrors(
    async (req, res, next)=>{
        const id = req.params.id;
        
        Products.findByIdAndUpdate(id, req.body,{
            userFindAndModify:false
        }).then(product=>{
            if (!product) {
                    return next(new ErrorHandler("Product Not Found",404))
                
              } else 
              res.status(200).json({
                    success:true,
                    message:"Product was updated successfully",
                    product 
                })
            
        });
    
    }
);

// Delete Product -Admin
exports.deleteProduct = catchAsyncErrors(
    async (req, res, next)=>{
        const id = req.params.id;
        const product = await Products.findByIdAndUpdate(id);
    
        if(!product){
            return next(new ErrorHandler("Product Not Found",404))
        }
       await product.remove();
       res.status(200).json({
           success:true,
           message:"Product delete successfully"
       })
    }
);

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Products.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) { 
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Get All Reviews of a product
  exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Products.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  
  // Delete Review
  exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Products.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Products.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });