const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const userRoute = require("./user.route");
const chatRoute = require("./chat.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware.settingGeneral);
    app.use("/",homeRoute);
    app.use("/chat",chatRoute);
    app.use("/search",searchRoute);
    app.use("/products",productRoute);
    app.use("/cart",cartRoute);
    app.use("/checkout",checkoutRoute);
    app.use("/user",userRoute);
}