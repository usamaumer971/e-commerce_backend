const express= require('express');
const app=express();
const cookieParser = require("cookie-parser");

const errorMiddleware = require ('./middleware/error') ; 

app.use(express.json());
app.use(cookieParser());


// Route import
const product=require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
app.use('/app',product);
app.use('/app',user);
app.use('/app',order);

// Middleware for error 
app.use(errorMiddleware);

module.exports= app;