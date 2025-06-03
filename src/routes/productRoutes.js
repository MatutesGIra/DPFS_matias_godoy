let express = require('express');
let productController = require("../controllers/productController");
let router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images/products'));
    },
    filename: (req, file, cb) => {
        const newFilename = 'product-' + Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });

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
router.get('/:id', productController.detailProducts);
router.get('/:id/edit', authMiddleware, productController.editForm);
router.get('/create', authMiddleware, [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres.'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria.')
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres.')
], productController.create);


router.post('/', authMiddleware, productController.create);
router.put('/:id', authMiddleware, upload.single('image'), [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres.'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria.')
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres.')
], productController.edit);
router.delete('/:id', authMiddleware, productController.destroy);

router.get('/api/products', productController.apiProducts);
router.get('/api/products/:id', productController.apiProductDetail);

module.exports = router;