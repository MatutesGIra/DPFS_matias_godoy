let express = require('express');
let indexController = require('../controllers/indexController');
let router = express.Router();

router.get("/", indexController.getHome);

module.exports = router;