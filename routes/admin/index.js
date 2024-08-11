const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const trashRoute = require("./trash.route")
const roleRoute = require("./role.route")
const accountRoute = require("./account.route")
const myAccountRoute = require("./my-account.route")
const authRoute = require("./auth.route")
const settingRoute = require("./setting.route")
const productCategoryRoute = require("./product-category.route")
const systemConfig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRoute);
    app.use(PATH_ADMIN + "/products",authMiddleware.requireAuth,productRoute);
    app.use(PATH_ADMIN + "/trash",authMiddleware.requireAuth,trashRoute);
    app.use(PATH_ADMIN + "/roles",authMiddleware.requireAuth,roleRoute);
    app.use(PATH_ADMIN + "/accounts",authMiddleware.requireAuth,accountRoute);
    app.use(PATH_ADMIN + "/my-account",authMiddleware.requireAuth,myAccountRoute);
    app.use(PATH_ADMIN + "/setting",authMiddleware.requireAuth,settingRoute);
    app.use(PATH_ADMIN + "/auth",authRoute);
    app.use(PATH_ADMIN + "/products-category",authMiddleware.requireAuth,productCategoryRoute);
}