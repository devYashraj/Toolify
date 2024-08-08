const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils')
const AdminController = require('../Controllers/AdminController')

router.post("/quotation", authenticateToken, AdminController.updateQuotation);

router.post("/purchase", authenticateToken, AdminController.updatePurchase);

router.post("/payment", authenticateToken, AdminController.updatePayment)

module.exports = router;