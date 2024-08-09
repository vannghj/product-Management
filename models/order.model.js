const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id: String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String,
        },
        products: [
            {
                product_id:String,
                price: Number,
                discountPercentage: Number,
                quantity: Number
            }
        ],
        cart_id: String,
        "deleted": {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    }, {
        timestamps: true
    });

const Order = mongoose.model('Order', orderSchema, "orders");

module.exports = Order;