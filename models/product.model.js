const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
            "title": String,
            "description": String,
            "price": Number,
            "discountPercentage": Number,
            "stock": Number,
            "thumbnail": String,
            "status": String,
            "position": Number,
            slug: {
                type: String,
                slug: "title",
                unique: true
            },
            "deleted": {
                type: Boolean,
                default: false
            }
    }, {
        timestamps: true
    });

const product = mongoose.model('product', productSchema, "products");

module.exports = product;