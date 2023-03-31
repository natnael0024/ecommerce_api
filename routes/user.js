const router = require('express').Router()
const { User } = require('../models/user')
const {verifyToken, verifyTokenAndAutherization, verifyTokenAndAdmin} = require('./verifyToken')
const CryptoJS = require("crypto-js")


//update
router.put("/update/:id",verifyTokenAndAutherization, async(req,res)=>{
    if(req.body.password)
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_DEC).toString()
    try{
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set: req.body
    },
    {new:true})
    res.status(200).json(updatedUser)
}catch(err){
    res.status(500).json(err)
}
})

// delete
router.delete("/delete/:id",verifyTokenAndAutherization,async (req,res)=>{
    try{
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    res.status(200).json("user has been removed")
    }catch(err){
        res.status(500).json(err)
    }
} )

//get
router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
    const user = await User.findById(req.params.id)
    const {password, ...others} = user._doc
    res.status(200).json({...others})
    }catch(err){
        res.status(500).json(err)
    }
})

//get all
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    const query = req.query.new
    try{
        const users = query? await User.find().sort({_id:-1}).limit(3) : await User.find()
        res.status(200).json(users)
    }catch(err){
        res.status(500).json(err)
    }
})

//get user stats
router.get("/stats", verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date()
    const lastyear = new Date(date.setFullYear(date.getFullYear()-1))

    try{
        const data = await User.aggregate([
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