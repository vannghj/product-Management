const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
        "title": String,
        "product_category_id": {
            type: String,
            default: ""
        },
        "description": String,
        "price": Number,
        "discountPercentage": Number,
        "stock": Number,
        "thumbnail": String,
        "status": String,
        "featured": String,
        "position": Number,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        "createdBy": {
            account_id: String,
            createAt: {
                type: Date,
                default: Date.now()
            }
        },

        "deleted": {
            type: Boolean,
            default: false
        },
        updateBy: [{
            account_id: String,
            updateAt: Date
        }],
        deletedBy: {
            account_id: String,
            deleteAt: Date
        },
    },
    {
        timestamps: true
    });

const product = mongoose.model('product', productSchema, "products");

module.exports = product;