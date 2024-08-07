const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productCatorySchema = new mongoose.Schema(
    {
        "title": String,
        "parent_id": {
            type: String,
            default: ""
        },
        "description": String,
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

const productCategory = mongoose.model('productCategory', productCatorySchema, "products-category");

module.exports = productCategory;