const Product = require("../../models/product.model")
const fillerStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const {query} = require("express");

module.exports.index = async (req, res) => {
    const filterStatus = fillerStatusHelper(req.query);
    let find = {
        deleted: false
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
    res.render("admin/pages/products/index", {
        pageTitle: "danh sach san pham",
        products: product,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({_id: id},{status: status});
    req.flash("success", "Cap nhat trang thai thanh cong");
    res.redirect("back");
}

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany( {_id:{$in:ids}},{status: "active"});
            req.flash("success", `Cap nhat trang thai ${ids.length} thanh cong`);
            break;
        case "inactive":
            await Product.updateMany( {_id:{$in:ids}},{status: "inactive"});
            req.flash("success", `Cap nhat trang thai ${ids.length} san pham thanh cong`);
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in:ids}}, {deleted: true});
            req.flash("success", `Cap nhat trang thai ${ids.length} san pham thanh cong`);
            break;
        case "change-position":
            console.log(ids);
            for ( const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id:id}, {position:position});
                req.flash("success", `Da doi vi tri ${ids.length} thanh cong`);
            }
            break;
        default:
            break;
    }
    res.redirect("back");
}

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id : id} , {deleted: true});
    req.flash("success", "Xoa thanh cong");
    res.redirect("back");
}


module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Them moi san pham",
    });
};
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    if(req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    const product = new Product(req.body);
    await product.save();
    res.redirect(`/admin/products`);
};
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
        console.log(product);
        res.render("admin/pages/products/edit", {
            pageTitle: "Chinh sua san pham",
            product: product
        });
    } catch (error) {
        res.redirect("../../../admin/products");
    }
};
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    if(req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({
            _id: req.params.id
        }, req.body);
        req.flash("success", `Cap nhat thanh cong`);
    } catch (error) {
        req.flash("error", `Cap nhat that bai`);
    }

    res.redirect("back");
};
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect("../../../admin/products");
    }
};
