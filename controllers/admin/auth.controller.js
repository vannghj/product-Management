const Account = require("../../models/account.model");

const md5 = require("md5");
module.exports.login = async (req, res) => {
    if(req.cookies.token) {
        res.redirect("/admin/dashboard");
    }else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Dang nhap",
        });
    }
};
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await Account.findOne({
        email:email,
        deleted: false
    })
    if(!user) {
        req.flash("error", "Email khong ton tai");
        res.redirect("back");
        return;
    }

    if(md5(password) != user.password) {
        req.flash("error", "Sai mat khau");
        res.redirect("back");
        return;
    }
    if(user.status == "inactive") {
        req.flash("error", "Tai khoan bi khoa");
        res.redirect("back");
        return;
    }
    const expriresCookie = 30*21*60*1000;
    res.cookie("token", user.token, {
        expires: new Date(Date.now()+ expriresCookie)
    });
    res.redirect("/admin/dashboard");
};
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`/admin/auth/login`)
};