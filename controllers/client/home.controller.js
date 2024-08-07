const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/create-tree");
module.exports.index = async (req, res) => {
    const records = await ProductCategory.find({
        deleted: false
    });
    const newProductCategory = createTreeHelper.tree(records);

    res.render("client/pages/home/index", {
        pageTitle: "Trang chu",
        layoutProductCategory: newProductCategory
    });
};