const router = require('express').Router()
const {User} = require('../models/user')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')


// register
router.post("/register", async(req,res)=>{
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.PASS_DEC)
    })
try{
    user = await user.save()
    res.status(201).json(user)
}catch(err){res.status(500).json(err)}
})


// login
router.post('/login',async(req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username})
        !user && res.status(401).send("Wrong username")
        const pass = CryptoJS.AES.decrypt(user.password, process.env.PASS_DEC)
        const dec = pass.toString(CryptoJS.enc.Utf8)
        dec != req.body.password && res.json("Wrong password")
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin :user.isAdmin
        }, process.env.JWT_SEC, {expiresIn:"3d"}
        )
        const {password, ...others} = user._doc
        res.status(200).json({...others, accessToken})
    }catch(err) {}
})


module.exports = router