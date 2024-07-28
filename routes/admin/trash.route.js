const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/trash.controller");

router.get("/", controller.index);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.patch("/revive/:id", controller.reviveItem);
module.exports = router;
