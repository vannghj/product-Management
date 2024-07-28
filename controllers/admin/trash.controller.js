const Product = require("../../models/product.model")
const fillerStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const {query} = require("express");

module.exports.index = async (req, res) => {
    const filterStatus = fillerStatusHelper(req.query);
    let find = {
        deleted: true
    }
    if(req.query.status) {
        find.status = req.query.status;
    }
    const objectSearch = searchHelper(req.query);
    let keyword = "";
    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    //phan trang
    const coutProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4
        },
        req.query,
        coutProducts
    );

    //end phan trang
    const product = await Product.find(find)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)
        .sort({position:"desc"});
    res.render("admin/pages/trash/index", {
        pageTitle: "danh sach san pham",
        products: product,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "delete-all":
            await Product.deleteMany({_id: {$in:ids}}, );
            req.flash("success", `Xoa ${ids.length} san pham thanh cong`);
            break;
        case "revive-all":
            await Product.updateMany({_id: {$in:ids}}, {deleted: false});
            req.flash("success", `Phuc hoi ${ids.length} san pham thanh cong`);
            break;
        default:
            break;
    }
    res.redirect("back");
}

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.deleteOne({_id : id} ,);
    req.flash("success", "Xoa thanh cong");
    res.redirect("back");
}
module.exports.reviveItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id : id} , {deleted: false});
    req.flash("success", "Phuc hoi thanh cong");
    res.redirect("back");
}

