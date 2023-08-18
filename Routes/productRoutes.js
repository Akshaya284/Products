const productController = require('../Controllers/productControllers');
const auth = require('../Middlewares/auth')

const express = require('express');
const router = express.Router();

router.post("/create-product", productController.createProduct);
router.put("/:id", productController.editProduct);
router.get("/:id", productController.getProductById);
router.get("/", productController.getProducts);
router.delete("/:id", productController.deleteProductById);

module.exports = router;