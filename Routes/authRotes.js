const express = require('express');
const router = express.Router();
const auth = require("../Middlewares/auth")
const productController = require('../Controllers/productControllers');



router.get("/check-user-role", auth.authenticateToken, productController.checkUserRole)

module.exports = router;