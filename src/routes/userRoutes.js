let express = require('express');
let userController = require("../controllers/userController");
let router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images/users'));
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

router.post('/register', upload.single('avatar'), userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

module.exports = router;