const express = require('express');
const { isAdmin } = require('../middlewares/verifyToken');
const Product = require('../models/Product')

const router = express.Router();
// add product
router.post('/add',isAdmin,async(req,res)=>{
    try {
        const product = await new Product(req.body)
        await product.save();
        res.status(201).json(product);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// updtate Product
router.put('/edit/:id',isAdmin,async(req,res)=>{
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        await updatedProduct.save();
        res.status(201).json(updatedProduct);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


router.delete('/destroy/:id',isAdmin,async(req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('Product has been deleted')
    } catch (error) {
        res.status(500).json(error.message)
    }
})

// GET Product

router.get('/find/:id',async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product)
        
    } catch (error) {
        res.status(500).json(error.message)
    }
})

// Get All Products
router.get('/',async(req,res)=>{
    const qNew = req.query.new
    const qCategory = req.query.category
    try {
        let products;
        if(qNew){
             products = await Product.find().sort({'createdAt':-1}).limit(5)
        }else if(qCategory){
            products = await Product.find({categories:{
                $in : [qCategory]
            }}).sort({'createdAt':-1}).limit(5)
        }else{
            products = await Product.find().sort({'createdAt':-1}).limit(5)
        }
        res.status(200).json(products);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


module.exports = router
