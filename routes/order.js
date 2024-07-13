const router = require('express').Router()
const {Order} = require('../models/order')
const {verifyToken, verifyTokenAndAutherization, verifyTokenAndAdmin} = require('./verifyToken')
const CryptoJS = require("crypto-js")

//create
router.post("/create",verifyToken, async (req,res)=>{
    let newOrder = new Order(req.body)
    try{
    newOrder = await newOrder.save()
    res.status(200).json(newOrder)
    }catch(err){
        res.status(500).json(err)
    }
})

//update
router.put("/update/:id",verifyTokenAndAdmin, async(req,res)=>{
    try{
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
        $set: req.body
    },
    {new:true})
    res.status(200).json(updatedOrder)
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
    const orders = await Order.find({userId: req.params.userId})
    res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
})


//get all
router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    try{
        const orders = await Order.find()
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
})


// get monthly income
router.get("/income",verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth()-1))

    const income = await Order.aggregate([
        { $match: { createdAt: { $gte: prevMonth}}},
            {
                $project:{
                    month: {$month: "$createdAt"},
                    sales: "$amount"
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: "$sales"}
                }
            }
    ])
    res.status(200).json(income)
})

module.exports = router