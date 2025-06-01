let express = require('express');
let productController = require("../controllers/productController");
let router = express.Router();

router.get('/cart', productController.viewCart);

router.get('/', productController.viewProducts);

router.get('/create', productController.createForm);

router.post('/', productController.create);

router.get('/:id', productController.detailProducts);

router.get('/:id/edit', productController.editForm);

router.put('/:id', productController.edit);

router.delete('/:id', productController.destroy);

module.exports = router;