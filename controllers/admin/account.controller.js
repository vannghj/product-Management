const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Account.find(find).select("-password -token");
    for (const record of records) {
        const role = await Role.findOne({
            deleted: false,
            _id: record.role_id
        });
        record.role = role;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sach tai khoan",
        records: records
    });
};
module.exports.create = async (req, res) => {
    const roles = await Role.find();

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tao moi tai khoan",
        roles:roles
    });
};
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({email: req.body.email}, {deleted:false});
    if(emailExist) {
        req.flash("error","Email da ton tai");
        res.redirect("back");
    } else {
        req.body.password=md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
        res.redirect("/admin/accounts");
    }
};
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    }
    try {
        const data = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false,
        });
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chinh sua tai khoan",
            roles:roles,
            data:data
        });
    } catch (error) {
        res.redirect("/admin/accounts");
    }
};
module.exports.editPatch = async (req, res) => {
    const emailExist = await Account.findOne({
        _id: { $ne: req.params.id},
        email: req.body.email}, {deleted:false}
    );
    if(emailExist) {

        req.flash("error","Email da ton tai");
        res.redirect("back");
    } else {
        if(req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
        console.log(req.body);
        await Account.updateOne({_id: req.params.id}, req.body);
        req.flash("success", "Cap nhat tai khoan thanh cong");
        res.redirect("back");

    }
};

