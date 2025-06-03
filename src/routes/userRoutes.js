let express = require('express');
let userController = require("../controllers/userController");
let router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images/users'));
    },
    filename: (req, file, cb) => {
        const newFilename = 'avatar-' + Date.now() + path.extname(file.originalname);
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

router.get('/login', guestMiddleware, userController.getLogin);
router.get('/register', guestMiddleware, userController.getRegister);
router.get('/profile', authMiddleware, userController.getProfile);

router.post('/register', upload.single('avatar'), [
    body('firstName')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    body('lastName')
        .notEmpty().withMessage('El apellido es obligatorio.')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio.')
        .isEmail().withMessage('Debes ingresar un formato de email válido.')
        .custom(async (value) => {
            const user = await db.User.findOne({ where: { email: value } });
            if (user) {
                throw new Error('Este email ya está registrado.');
            }
            return true;
        }),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.')
], userController.register);
router.post('/login', [
    body('email')
        .notEmpty().withMessage('El email es obligatorio.')
        .isEmail().withMessage('Debes ingresar un formato de email válido.'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
], userController.login);
router.get('/logout', userController.logout);

router.get('/api/users', userController.apiUsers);
router.get('/api/users/:id', userController.apiUserDetail);

module.exports = router;