const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    })
    const newProductFeatured = productsHelper.priceNewProduct(productsFeatured);
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position:"desc"}).limit(6);
    const newProductsNew = productsHelper.priceNewProduct(productsNew);
    res.render("client/pages/home/index", {
        pageTitle: "Trang chu",
        productsFeatured: newProductFeatured,
        productsNew:newProductsNew
    });
};