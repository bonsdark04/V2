const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");
const multer  = require('multer')
const storageMulterHelper = require("../../helper/storageMulter");
const storage = storageMulterHelper();
const validate = require("../../validates/admin/product.validate");


const upload = multer({ storage: storage })

router.get("/",controller.index);

router.patch("/change-status/:status/:id",controller.changeStatus);

router.patch("/change-multi",controller.changeMulti);

router.delete("/delete/:id",controller.delete);

router.get("/create", controller.createGet);

router.post("/create",
            upload.single('thumbnail'),
            validate.createPost,
            controller.createPOST
            );

router.get("/edit/:id",
            upload.single('thumbnail'),
            controller.edit
          );
router.patch("/edit/:id",
            upload.single('thumbnail'),
            validate.createPost,
            controller.editPatch
          );


router.get("/detail/:id",controller.detail);
module.exports = router;