module.exports.createPost = (req,res, next) => {
    if(!req.body.fullName) {
        req.flash("error", `Vui long nhap ho ten`);
        res.redirect("back");
        return;
    }
    next();
}