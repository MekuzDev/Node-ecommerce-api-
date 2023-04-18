const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const AuthRouter = require('./routes/auth')
const orderRouter = require('./routes/order')

dotenv.config();
const app = express()
app.use(express.json());
app.use('/api/auth/',AuthRouter);
app.use('/api/users/',userRouter);
app.use('/api/products/',productRouter);
app.use('/api/cart/',cartRouter);
app.use('/api/order/',orderRouter);

app.get('/api/',(req,res)=>{
    res.send('server created successfully');
})



async function connectDB(){
    try{
        
       await mongoose.connect(process.env.MONGO_URL);
       await console.log('Database Connected');
       
    }catch(err){
      console.log(err);
    }
}

app.listen(5000 || process.env.PORT,()=>{
  console.log('Backend Server is running')
})

// Listening for backend server
connectDB();
