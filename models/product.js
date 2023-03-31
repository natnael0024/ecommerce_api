const mongoose = require('mongoose')

const Product = new mongoose.model('Product', mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    category:{
        type: Array,
        required: true
    },
    size: {
        type: Array,
    },
    color: {
        type: Array,
    },
    price: {
        type: Number,
    },

},{ timestamps: true}))

module.exports.Product = Product