module.exports.loginPost = (req,res, next) => {
    if(!req.body.email) {
        req.flash("error", `Vui long nhap email`);
        res.redirect("back");
        return;
    }
    if(!req.body.password) {
        req.flash("error", `Vui long nhap matkhau`);
        res.redirect("back");
        return;
    }
    next();
}