const mongoose = require('mongoose')

const Cart = new mongoose.model('Cart', mongoose.Schema({
   userId: { 
        type: String,
        required: true,
    },
  product:[ {
    productId:{
        type: String
    },
    quantity:{
        type: Number,
        default: 1
    }
}
]

},{ timestamp: true}))

module.exports.Cart = Cart