const express = require('express');
const { isAdmin, verifyToken, verifyAndAuthorizeToken } = require('../middlewares/verifyToken');
const Cart = require('../models/Cart')

const router = express.Router();
// add product
router.post('/add',verifyToken,async(req,res)=>{
    try {
        const newCart = await new Cart(req.body)
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// update Cart
router.put('/edit/:id',verifyAndAuthorizeToken,async(req,res)=>{
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        await updatedCart.save();
        res.status(201).json(updatedCart);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


router.delete('/destroy/:id',verifyAndAuthorizeToken,async(req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart has been deleted')
    } catch (error) {
        res.status(500).json(error.message)
    }
})


// GET User Cart

router.get('/find/:userId',verifyAndAuthorizeToken,async (req,res)=>{
    try {
        const cart = await Cart.findOne(req.params.userId);
        res.status(200).json(cart)
        
    } catch (error) {
        res.status(500).json(error.message)
    }
})
// Get All Products
router.get('/',isAdmin,async(req,res)=>{
    try {
        
    const usersCart = Cart.find();
    res.send(usersCart)
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


module.exports = router
