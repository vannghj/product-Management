const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCoud.middleware");
const validate = require("../../validates/admin/account.validate");

const controller = require("../../controllers/admin/account.controller");
router.get("/", controller.index);
router.get("/create", controller.create);
router.get("/edit/:id", controller.edit);
router.post(
    "/create",
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost);
router.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch);
module.exports = router;
