const express = require('express');
const router = express.Router();
const controller = require("../controllers/product.controller");

router.get("/", controller.index);
router.get("/categories", controller.categories);
router.get("/:slugProduct", controller.detail);
router.get("/category/:slugCategory", controller.category);

module.exports = router;
