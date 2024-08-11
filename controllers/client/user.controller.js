const md5 = require("md5");
const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Dang ki tai khoan",
    });
};
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email:req.body.email
    })
    if(existEmail) {
        req.flash("error", "Email da ton tai!");
        res.redirect("back");
        return;
    }
    req.body.password= md5(req.body.password);
    const user = new User(req.body);
    user.save();
    const expriresCookie = 24* 60 * 60 * 1000 * 90;
    res.cookie("tokenUser", user.tokenUser, {
        expires: new Date(Date.now()+ expriresCookie)
    });
    res.redirect("/");
};
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Dang nhap",
    });
};
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email:email,
        deleted: false
    })
    if(!user) {
        req.flash("error", "Email khong ton tai!");
        res.redirect("back");
        return;
    }
    if(md5(password) !== user.password) {
        req.flash("error", "Sai mat khau!");
        res.redirect("back");
        return;
    }
    if(user.status === "inactive") {
        req.flash("error", "Tai khoan da bi khoa!");
        res.redirect("back");
        return;
    }
    const cart = await Cart.findOne({
        user_id: user.id
    })
    if(cart) {
        res.cookie("cartId", cart.id);
    }else {
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id
        })
    }
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/");
};
module.exports.logout = async (req, res) => {
    res.clearCookie("cartId");
    res.clearCookie("tokenUser");
    res.redirect("back");

};
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quen mat khau",
    });

};
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if(!user) {
        req.flash("error", "Email khong ton tai!");
        res.redirect("back");
        return;
    }
    const otp = generateHelper.generateRandomNumber(5);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAt: Date.now()
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    const subject = "Ma OTP xac minh lay lai mat khau";
    const html = `
        Ma OTP de lay lai mat khau la <b>${otp}</b>. Thoi han su dung la 3 phut.
    `
    sendMailHelper.sendMail(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);


};
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhap ma OTP",
        email: email,
    });

};
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if(!result) {
        req.flash("error", "OTP khong hop le");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email
    })
    res.cookie("tokenUser", user.tokenUser);
    res.redirect('/user/password/reset');
};
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Doi mat khau",
    });

};
module.exports.resetPasswordPost = async (req, res) => {
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;
   const tokenUser = req.cookies.tokenUser;
   await User.updateOne({
       tokenUser: tokenUser,
   }, {
       password: md5(password)
   })
   res.redirect("/");
};
module.exports.info = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const infoUser = await User.findOne({
        tokenUser: tokenUser,
    }).select("-password");
    res.render("client/pages/user/info", {
        pageTitle: "Thong tin tai khoan",
        infoUser: infoUser,
    });
};

