const express = require('express');
const User = require('../models/User');
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')
const AuthRouter = express.Router();

// REGISTER

AuthRouter.post("/register/",async (req,res)=>{
    try {
        const newUser = await new User({
            username:req.body.username,
            email:req.body.email,
            password: cryptoJs.AES.encrypt(req.body.password, process.env.SECRET_PHRASE).toString()
        })
       const savedUser =  await newUser.save();  
       res.status(201).json(savedUser);
    } catch (error) {
        return res.status(500).json({
            error:error.message
        })
    }
})

AuthRouter.post('/login',async (req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(401).json({massage:'Credentials entered do not match our records'})
        }
        const hashedPassword = user.password;
        const decrypted = cryptoJs.AES.decrypt(hashedPassword, process.env.SECRET_PHRASE).toString(cryptoJs.enc.Utf8);
        if(decrypted !== req.body.password){
            return res.status(401).json({massage:'Credentials entered do not match our records'}) 
        }

        const {password,...others} = user._doc;
        const token = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.JWT_SECRET,{expiresIn:'3d'})


        return res.status(200).json({...others,token});
        
        
    } catch (error) {
        
    }


})


module.exports = AuthRouter
