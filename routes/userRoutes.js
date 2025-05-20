let express = require('express');
let userController = require("../controllers/userController");
let router = express.Router();

router.get('/login', userController.getLogin);

router.get('/register', userController.getRegister);

module.exports = router;