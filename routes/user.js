const express = require('express');
const { verifyToken, verifyAndAuthorizeToken, isAdmin } = require('../middlewares/verifyToken');
const User = require('../models/User');
const userRouter = express.Router();

// Update User
userRouter.put('/edit/:id',verifyAndAuthorizeToken,async (req,res)=>{
  if(req.body.password){
    request.body.password = cryptoJs.AES.encrypt(req.body.password, process.env.SECRET_PHRASE).toString()
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:req.body
    },{new:true})
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({error:error.message})
  }
})

// DELETE USER
userRouter.delete('/destroy/:id',verifyAndAuthorizeToken,async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted')
    } catch (error) {
        res.status(500).json(error.message)
    }
})


// GET USER
userRouter.get('/find/:id',isAdmin,async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password,__v,_id, ...others} = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

// Get All Users
userRouter.get('/',isAdmin,async (req,res)=>{
    const query = req.query.new
    try {
        
        const users = query ? 
        await User.find().sort({_id:-1}).limit(5)
        : await User.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

// User Stat
userRouter.get('/stat/',isAdmin,async (req,res)=>{
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear()-1))
 

  try {
    const data = await User.aggregate([
        {$match:{createdAt:{$gte:lastYear}}},
        {
            $project:{
            month:{$dayOfWeek:'$createdAt'}
        }
    },
    {$group:{
        _id:"$month",
        total:{$sum: 1 }
    }}
    ])
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(err.message)
  }
})

module.exports = userRouter
