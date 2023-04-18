const express = require('express');
const { isAdmin, verifyToken, verifyAndAuthorizeToken } = require('../middlewares/verifyToken');
const Order = require('../models/Order')

const router = express.Router();
// add Order
router.post('/add',verifyToken,async(req,res)=>{
    try {
        const newOrder = new Order(req.body)
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// update Order
router.put('/edit/:id',isAdmin,async(req,res)=>{
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        await updatedOrder.save();
        res.status(201).json(updatedOrder);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// Delete Order
router.delete('/destroy/:id',isAdmin,async(req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart has been deleted')
    } catch (error) {
        res.status(500).json(error.message)
    }
})


// GET User Orders

router.get('/find/:userId',isAdmin,async (req,res)=>{
    try {
        const orders = await Cart.findById(req.params.userId);
        res.status(200).json(orders)
        
    } catch (error) {
        res.status(500).json(error.message)
    }
})
// Get All Users Orders
router.get('/',isAdmin,async(req,res)=>{
    try {
        
    const usersOrders = Order.find();
    res.send(usersOrders)
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


// Get Income Stats


router.get("/income",isAdmin,async(req,res)=>{
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() -1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1))
    try {
        const income = await Order.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {$project:{month : {$month:"$createdAt"},sales : "$amount",},},
            {$group:{_id:"$month",total:{$sum:"$sales"}}} 
        ]);

        res.status(200).send(income)
        
    } catch (error) {
      res.status(500).json(error.message)  
    }
})

module.exports = router
