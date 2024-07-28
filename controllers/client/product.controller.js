const product = require("../../models/product.model");
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await product.find({
        status: "active",
        deleted: false
    }).sort({position:"desc"});

    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed();
    });
    res.render("client/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: products
    })
};

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        }
        const product = await Product.findOne(find);
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect("../../../products");
    }
};