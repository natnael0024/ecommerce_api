const express = require("express")

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const users = require('./routes/user');
const { json } = require('express');
const auth = require('./routes/auth')
const cors = require('cors')

const products = require('./routes/product')
const orders = require("./routes/order")

const app = express();

dotenv.config()

mongoose.connect("mongodb://localhost/factosdb")
.then(()=>console.log("db connected"))
.then(app.listen(5000,()=>{console.log("server running on port 5000")}))
.catch((err)=>console.log(err.message)) 


app.use(cors({
    origin: "*"
}))

app.use(express.json())
app.use("/api/users",users) 
app.use("/api/auth", auth)
app.use("/api/products",products)
app.use("/api/orders",orders)