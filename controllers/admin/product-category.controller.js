const ProductCategory = require("../../models/product-category.model");
const crateTreeHelper = require("../../helpers/create-tree");
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find);
    const newRecords = crateTreeHelper.tree(records);
    res.render("admin/pages/products-category/index", {
        pageTitle: "danh sach san pham",
        records: newRecords
    });
};
//create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await  ProductCategory.find(find);
    const newRecords = crateTreeHelper.tree(records);
    res.render("admin/pages/products-category/create", {
        pageTitle: "Tao danh muc",
        records: newRecords
    });
};
module.exports.createPost = async (req, res) => {

    if(req.body.position == "") {
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const record = new ProductCategory(req.body);
    await record.save();
    res.redirect(`/admin/products-category`);
};
//edit
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    let find = {
        deleted: false
    }
    const records = await  ProductCategory.find(find);
    const newRecords = crateTreeHelper.tree(records);
    const data = await ProductCategory.findOne({
        _id: id,
        deleted: false
    })
    res.render("admin/pages/products-category/edit", {
        pageTitle: "Chinh sua danh muc",
        data: data,
        records: newRecords
    });
};
module.exports.editPatch = async (req, res) => {
    req.body.position = parseInt(req.body.position);
    try {
        await ProductCategory.updateOne({
            _id: req.params.id
        }, req.body);
        req.flash("success", `Cap nhat thanh cong`);
    } catch (error) {
        req.flash("error", `Cap nhat that bai`);
    }
    res.redirect("back");
};