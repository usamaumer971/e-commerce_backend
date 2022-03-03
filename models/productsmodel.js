const mongoose = require ('mongoose');
const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        require:[true,"Please Enter Product Description "]
    },
    price:{
        type:Number,
        require:[true,"Please Enter Product Price "],
        maxLength:[8, "Price cannot exceed 8 figure"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                require:true
            },
            url:{
                type:String,
                require:true
            }
        }
    ],
    category :{
        type:String,
        require:[true,"Please Enter Product Category "],

    },
    Stock:{
        type : Number,
        require:[true,"Please Enter Product Stock "],
        maxLength:[3, "Stock cannot exceed 3 figure"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                require:true
            },
            rating:{
                type:Number,
                require:true
            },
            comment:{
                type:String,
                require:true
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

    
});
productSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

module.exports= mongoose.model('Product',productSchema);