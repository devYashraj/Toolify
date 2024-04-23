const express = require('express');
const router = express.Router();
const CustomerController = require('../Controllers/CustomerController');
const multer = require('multer');
const { authenticateToken } = require('../utils')


const storage = multer.memoryStorage();


const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/signup", CustomerController.createCustomer);

router.post("/sendorder", authenticateToken, upload.single('drawing'), CustomerController.createOrder);

module.exports = router;