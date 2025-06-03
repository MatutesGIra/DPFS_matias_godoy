let express = require('express');
let userController = require("../controllers/userController");
let router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const db = require('../../database/models');


// Configuración de Multer para la subida de avatares de usuario
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
    
    body('username')
        .notEmpty().withMessage('El nombre de usuario es obligatorio.')
        .isLength({ min: 4 }).withMessage('El nombre de usuario debe tener al menos 4 caracteres.')
        .custom(async (value) => {
            
            const user = await db.User.findOne({ where: { username: value } }); 
            if (user) {
                throw new Error('Este nombre de usuario ya está en uso.');
            }
            return true;
        }),
    
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
        // Incluí el guion bajo '_' en los caracteres especiales permitidos pero aun no lo acepta
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (ej. @$!%*?&_).'),

    body('confirm_password')
        .notEmpty().withMessage('Debes confirmar la contraseña.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden.');
            }
            return true;
        }),

    body('dateOfBirth')
        .notEmpty().withMessage('La fecha de nacimiento es obligatoria.')
        .isISO8601().withMessage('Formato de fecha inválido.')
        .custom((value) => {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                throw new Error('Debes ser mayor de 18 años para registrarte.');
            }
            return true;
        }),
    body('avatar')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Debes subir una imagen de perfil.');
            }
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            const fileExtension = path.extname(req.file.originalname).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                throw new Error('Solo se permiten archivos JPG, JPEG, PNG o GIF.');
            }
            return true;
        }),
    body('terms')
        .notEmpty().withMessage('Debes aceptar los Términos y Condiciones.')

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