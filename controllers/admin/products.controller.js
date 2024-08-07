const Product = require("../../models/product.model")
const Account = require("../../models/account.model")
const fillerStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const {query} = require("express");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/create-tree");

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

    //sort
    let sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    //
    //end phan trang
    const products = await Product.find(find)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)
        .sort(sort);
    for( const product of products) {
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        });
        if(user) {
            product.accountFullName = user.fullName;
        }
        // lay ra thong tin nguoi cap nhat gan nhat
        updateBy = product.updateBy[product.updateBy.length-1];
        if(updateBy) {
            const userUpdate = await Account.findOne({
                _id: updateBy.account_id
            });
            updateBy.fullName = userUpdate.fullName;
        }
    }
    res.render("admin/pages/products/index", {
        pageTitle: "danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    await Product.updateOne({_id: id},{
        status: status,
        $push: {updateBy: updatedBy}
    });
    req.flash("success", "Cap nhat trang thai thanh cong");
    res.redirect("back");
}

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    switch (type) {
        case "active":
            await Product.updateMany( {_id:{$in:ids}},{
                status: "active",
                $push: {updateBy: updatedBy}
            });
            req.flash("success", `Cap nhat trang thai ${ids.length} thanh cong`);
            break;
        case "inactive":
            await Product.updateMany( {_id:{$in:ids}},{
                status: "inactive",
                $push: {updateBy: updatedBy}
            });
            req.flash("success", `Cap nhat trang thai ${ids.length} san pham thanh cong`);
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in:ids}}, {deleted: true});
            req.flash("success", `Cap nhat trang thai ${ids.length} san pham thanh cong`);
            break;
        case "change-position":
            for ( const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id:id}, {position:position,$push: {updateBy: updatedBy}},);
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
    await Product.updateOne({_id : id} , {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
        },
    );
    req.flash("success", "Xoa thanh cong");
    res.redirect("back");
}


module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await  ProductCategory.find(find);
    const category = createTreeHelper.tree(records);
    res.render("admin/pages/products/create", {
        pageTitle: "Them moi san pham",
        category:category
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
    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    const product = new Product(req.body);
    await product.save();
    res.redirect(
        `/admin/products`,
    );
};
module.exports.edit = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const records = await  ProductCategory.find({
            deleted: false
        });
        const category = createTreeHelper.tree(records);
        const product = await Product.findOne(find);
        res.render("admin/pages/products/edit", {
            pageTitle: "Chinh sua san pham",
            product: product,
            category:category
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


    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updateAt: new Date()
        }
        await Product.updateOne({
            _id: req.params.id
        },
            {
                ...req.body,
                $push: {updateBy: updatedBy}
            });
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
