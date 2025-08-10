const express = require('express');
const router = express.Router();
const controller = require("../controllers/comment.controller");
const authMiddleware = require("../../middlewares/client/apiAuth.middleware");

router.post("/create", authMiddleware.requireAuth, controller.create);
router.get("/product/:product_id", controller.getByProduct);
router.put("/:id", authMiddleware.requireAuth, controller.update);
router.delete("/:id", authMiddleware.requireAuth, controller.delete);
router.get("/replies/:parent_id", controller.getReplies);

module.exports = router;
