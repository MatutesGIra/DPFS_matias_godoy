let express = require('express');
let productController = require("../controllers/productController");
let router = express.Router();

const guestMiddleware = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/users/profile');
    }
    next();
};

const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }
    next();
};

router.get('/cart', authMiddleware, productController.viewCart);

router.get('/', productController.viewProducts);

router.get('/create', authMiddleware, productController.createForm);

router.post('/', authMiddleware, productController.create);

router.get('/:id', productController.detailProducts);

router.get('/:id/edit', authMiddleware, productController.editForm);

router.put('/:id', authMiddleware, productController.edit);

router.delete('/:id', authMiddleware, productController.destroy);

module.exports = router;