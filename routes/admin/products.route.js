const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
//const storageMulter = require("../../helpers/storageMulter")
const streamifier = require('streamifier');
const upload = multer();
//cloudinary
const uploadCloud = require("../../middlewares/admin/uploadCoud.middleware");
const controller = require("../../controllers/admin/products.controller");
const validate = require("../../validates/admin/product.vaidate");
router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost)
router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),

    validate.createPost,
    controller.editPatch);
router.get("/detail/:id", controller.detail);
module.exports = router;
