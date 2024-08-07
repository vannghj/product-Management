const Account = require("../../models/account.model");
const md5 = require("md5");
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Thong tin ca nhan"
    });
};
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chinh sua thong tin ca nhan"
    });
};
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;
    const emailExist = await Account.findOne({
        _id: { $ne: id},
        email: req.body.email}, {deleted:false}
    );
    if(emailExist) {
        req.flash("error","Email da ton tai");
    } else {
        if(req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
        await Account.updateOne({_id: id}, req.body);
        req.flash("success", "Cap nhat thong tin tai khoan thanh cong");
    }
    res.redirect("back");
};

