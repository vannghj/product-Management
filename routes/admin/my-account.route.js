const express = require("express");
const controller = require("../../controllers/admin/my-account.controller");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCoud.middleware");
const validate = require("../../validates/admin/product.vaidate");
router.get("/", controller.index);
router.get("/edit", controller.edit);
router.patch("/edit",
    upload.single("avatar"),
    uploadCloud.upload,
    controller.editPatch,
);
module.exports = router;
