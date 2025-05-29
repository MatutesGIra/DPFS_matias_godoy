let express = require('express');
let productController = require("../controllers/productController");
let router = express.Router();

router.get('/detail', productController.detailProducts);

router.get('/create', productController.createProducts);

router.get('/edit', productController.editProducts);

module.exports = router;