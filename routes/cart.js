const router = require('express').Router()
const {Cart} = require('../models/cart')
const {verifyToken, verifyTokenAndAutherization, verifyTokenAndAdmin} = require('./verifyToken')
const CryptoJS = require("crypto-js")

//create
router.post("/create",verifyToken, async (req,res)=>{
    let newCart = new Cart(req.body)
    try{
    newProduct = await newCart.save()
    res.status(200).json(newCart)
    }catch(err){
        res.status(500).json(err)
    }
})
 
//update
router.put("/update/:id",verifyTokenAndAutherization, async(req,res)=>{
    try{
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{
        $set: req.body
    },
    {new:true})
    res.status(200).json(updatedCart)
}catch(err){
    res.status(500).json(err)
}
})

// delete
router.delete("/delete/:id",verifyTokenAndAutherization,async (req,res)=>{
    try{
    await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json("Item has been removed")
    }catch(err){
        res.status(500).json(err)
    }
} )

//get
router.get("/find/:userId",async(req,res)=>{
    try{
    const cart = await Product.findOne({userId: req.params.userId})
    res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
})

router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    try{
        const carts = await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router