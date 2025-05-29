let express = require('express');
let cartController = require('../controllers/cartController');
let router = express.Router();

router.get("/cart", cartController.viewCart);

module.exports = router;