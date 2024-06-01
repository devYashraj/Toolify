const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const saltRounds = 10;
const Customer = require('../Models/CustomerModel');
const Orders = require('../Models/OrderModel')
const PurchaseOrder = require('../Models/PurchaseModel')

require('dotenv').config()
const secretKey = process.env.secretKey;

async function createCustomer(req, res) {
    try {
        const data = req.body;
        const { email, password } = data;
        const existingUser = await Customer.findOne({ email: email });

        if (existingUser) {
            res.status(400).json({ error: "This email is already registered" });
        }
        else {

            bcrypt.hash(password, saltRounds, async (err, hashedpassword) => {
                if (err) {
                    console.log(err);
                }
                else {
                    data.password = hashedpassword;
                    const customerData = new Customer(data);
                    await customerData.save()
                        .then(() => console.log("Customer Created"))
                        .catch(err => console.log("Failed to create customer", err));
                    res.status(201).json({ message: "user created" });
                }
            })
        }
    }
    catch (error) {
        console.log(error);
    }
}


async function retrieveCustomer(req, res) {
    try {
        const { email, password } = req.body;
        const existingUser = await Customer.findOne({ email: email });

        if (!existingUser) {
            res.status(401).json({ error: "Invalid Credentials" });
        }
        else {
            const pwdMatch = await bcrypt.compare(password, existingUser.password);

            if (!pwdMatch) {
                res.status(401).json({ error: "Invalid Credentials" });
            }
            else {
                const token = jwt.sign({ userId: existingUser._id }, secretKey, { expiresIn: '1h' });
                const userData = {
                    _id: existingUser._id,
                    name: existingUser.name,
                    companyname: existingUser.companyName,
                    email: existingUser.email,
                    phno: existingUser.phno
                };
                res.status(201).json({ token, userData });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function getUniqueFilename(id) {
    try {
        const allorders = await Orders.find({ custId: id });
        return id + (allorders.length + 1);
    }
    catch (error) {
        console.log(error);
    }
}


async function saveFileToTempFolder(file, fileName) {
    const tempPath = path.join("C:/Users/HP/Documents/temp", fileName);
    try {
        await fs.promises.writeFile(tempPath, file.buffer);
        return tempPath;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function createOrder(req, res) {
    if (req.body && req.file) {

        console.log("all good once again");
        let orderData = {
            toolName: req.body.toolName,
            custId: req.body.custId,
            address: req.body.address,
            date: req.body.date
        }

        const fileName = await getUniqueFilename(req.body.custId);
        try {
            const filepath = await saveFileToTempFolder(req.file, fileName + ".pdf");
            if (filepath) {
                orderData = { ...orderData, filepath: filepath };
                const completeOrderData = new Orders(orderData);
                await completeOrderData.save().then(() => console.log("order created"));
                res.status(200).json({ message: "Order successfully made" });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}

async function retrieveAllOrders(req, res) {
    const custId = req.params.id;
    const status = req.params.status;
    try {
        const allOrders = await Orders.find({ custId: custId, status:status}).sort({ date: -1 });
        res.status(200).json({ allOrders });
    }
    catch (error) {
        console.log(error);
    }
}

function downloadDrawing(req, res) {
    const filepath = req.params.filepath;
    res.download(filepath);
}

async function createPurchaseOrder(req,res){
    const po = req.body;
    const {orderId} = po;
    console.log(orderId)
    try{
        await Orders.findOneAndUpdate(
            { _id: orderId },
            { $set: { status: "processing", date: new Date()} }
        );
        const newpo = new PurchaseOrder(po);
        await newpo.save()
        .then(res.status(200).json({msg:"purchase order made"}))
        .catch()
    }
    catch(error){
        console.log(error)
    }    
}

async function getPO(req, res) {
    const orderId = req.params.orderId;
    try{
        const order = await PurchaseOrder.findOne({orderId:orderId});
        res.status(200).json({order});
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    createCustomer,
    retrieveCustomer,
    createOrder,
    retrieveAllOrders,
    downloadDrawing,
    createPurchaseOrder,
    getPO
};