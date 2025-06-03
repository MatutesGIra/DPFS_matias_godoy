let express = require('express');
let productController = require("../controllers/productController");
let router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const db = require('../../database/models');

// Configuración de Multer para la subida de imágenes de productos
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

// Middleware para usuarios no logueados
const guestMiddleware = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/users/profile');
    }
    next();
};

// Middleware para usuarios logueados
const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }
    next();
};


router.get('/cart', authMiddleware, productController.viewCart);
router.get('/', productController.viewProducts);
router.get('/create', authMiddleware, productController.createForm);
router.get('/:id/edit', authMiddleware, productController.editForm);
router.get('/:id', productController.detailProducts);


router.post('/', authMiddleware, upload.single('image'), [  
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres.'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria.')
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres.'),
    body('categoryIds')
        .isArray().withMessage('Debe ser un array de IDs de categorías.')
        .custom((value, { req }) => {
            if (value.length === 0) {
                throw new Error('Debes seleccionar al menos una categoría.');
            }
            return true;
        }),
    body('image')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Debes subir una imagen para el producto.');
            }
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            const fileExtension = path.extname(req.file.originalname).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                throw new Error('Solo se permiten archivos JPG, JPEG, PNG o GIF.');
            }
            return true;
        })
], productController.create);

router.put('/:id', authMiddleware, upload.single('image'), [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres.'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria.')
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres.')
], productController.edit);
router.delete('/:id', authMiddleware, productController.destroy);


router.post('/add/:id', productController.addToCart); 
router.post('/update', productController.updateCart); 
router.delete('/remove/:id', productController.removeFromCart); 


router.get('/api/products', productController.apiProducts);
router.get('/api/products/:id', productController.apiProductDetail);

module.exports = router;