const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const validate = require("../../validates/admin/products-category.vaidate");
const uploadCloud = require("../../middlewares/admin/uploadCoud.middleware");
const controller = require("../../controllers/admin/product-category.controller");
router.get("/", controller.index);
router.get("/create", controller.create);
router.get("/edit/:id", controller.edit);
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);
module.exports = router;
