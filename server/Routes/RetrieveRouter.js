const express = require('express');
const router = express.Router();
const CustomerController = require('../Controllers/CustomerController');
const AdminController = require('../Controllers/AdminController')
const { authenticateToken } = require('../utils')

router.post("/signin", CustomerController.retrieveCustomer);

router.post("/signinadmin", AdminController.retrieveAdmin);

router.get("/allorders/:id", authenticateToken, CustomerController.retrieveAllOrders);

router.get("/allorders", authenticateToken, AdminController.getAllOrders);

router.get("/allcustomers", authenticateToken, AdminController.getAllCustomers);

router.get("/download/:filepath", authenticateToken, CustomerController.downloadDrawing);

router.get("/monthdata", authenticateToken, AdminController.getMonthlyOrderCounts);

router.get("/salesdata", authenticateToken, AdminController.getSalesData);



module.exports = router;