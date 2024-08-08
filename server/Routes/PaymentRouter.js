const express = require('express');
const router = express.Router();
const PaymentController = require('../Controllers/PaymentController')

router.post("/checkout", PaymentController.checkout)

router.post("/verify", PaymentController.verify)

module.exports = router;