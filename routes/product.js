const router = require('express').Router()
const {Product} = require('../models/product')
const {verifyToken, verifyTokenAndAutherization, verifyTokenAndAdmin} = require('./verifyToken')
const CryptoJS = require("crypto-js")

//create
router.post("/create",verifyTokenAndAdmin, async (req,res)=>{
    let newProduct = new Product(req.body)
    try{
    newProduct = await newProduct.save()
    res.status(200).json(newProduct)
    }catch(err){
        res.status(500).json(err)
    }
})

//update
router.put("/update/:id",verifyTokenAndAdmin, async(req,res)=>{
    try{
    const updatedProductItem = await User.findByIdAndUpdate(req.params.id,{
        $set: req.body
    },
    {new:true})
    res.status(200).json(updatedProductItem)
}catch(err){
    res.status(500).json(err)
}
})

// delete
router.delete("/delete/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("Item has been removed")
    }catch(err){
        res.status(500).json(err)
    }
} )

//get
router.get("/find/:id",async(req,res)=>{
    try{
    const productItem = await Product.findById(req.params.id)
    res.status(200).json(productItem)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all
router.get("/",async(req,res)=>{
    const newQuery = req.query.new
    const categoryQuery = req.query.category

    try{
        let items;

        if(newQuery){
            items = await Product.find().sort({createdAt: -1}).limit(5)
        }
        else if(categoryQuery){
            items = await Product.find({
                category: {
                    $in: [categoryQuery],
                }
            })
        }else {
            items = await Product.find()
        }
        res.status(200).json(items)
    }catch(err){
        res.status(500).json(err)
    }
})

//get user stats
router.get("/stats", verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date()
    const lastyear = new Date(date.setFullYear(date.getFullYear()-1))

    try{
        const data = await Product.aggregate([
            { $match: { createdAt: { $gte: lastyear}}},
            {
                $project:{
                    month: {$month: "$createdAt"},
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ])
        res.status(200).json(data)

    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router