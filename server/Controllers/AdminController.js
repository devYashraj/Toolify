const Orders = require('../Models/OrderModel')
const Admin = require('../Models/AdminModel')
const Customers = require('../Models/CustomerModel')
const PurchaseOrder = require('../Models/PurchaseModel');
const Payment = require('../Models/PaymentsModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config()
const secretKey = process.env.secretKey;

async function getMonthlyOrderCounts(req, res) {
    try {

        const pipeline = [
            {
                $group: {
                    _id: { $month: '$date' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    count: 1
                }
            }
        ];

        const monthlyCounts = await Orders.aggregate(pipeline);

        const result = Array(12).fill(0);

        monthlyCounts.forEach(item => {
            result[item.month - 1] = item.count;
        });

        const monthdata = result;
        res.status(200).json({ monthdata })
    } catch (error) {
        console.error('Error fetching monthly order counts:', error);
        throw error;
    }
}

async function getSalesData(req, res) {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const currentYearPipeline = [
        {
            $match: {
                $expr: { $eq: [{ $year: "$date" }, currentYear] },
                status: { $in: ["delivered", "paid"] }
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        }
    ];

    const currentMonthPipeline = [
        {
            $match: {
                $expr: { $eq: [{ $year: "$date" }, currentYear] },
                $expr: { $eq: [{ $month: "$date" }, currentMonth] },
                status: { $in: ["delivered", "paid"] }
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        }
    ];

    try {
        const currentYearTotal = await Orders.aggregate(currentYearPipeline);
        const currentMonthTotal = await Orders.aggregate(currentMonthPipeline);

        let yearTotal = 0, monthTotal = 0;
        if (currentYearTotal.length !== 0)
            yearTotal = currentYearTotal[0].totalAmount;
        if (currentMonthTotal.length !== 0)
            monthTotal = currentMonthTotal[0].totalAmount

        const saleData = {
            year: yearTotal,
            month: monthTotal
        }
        res.status(200).json({ saleData });
    }
    catch (error) {
        console.log(error);
    }
}

async function getAllOrders(req, res) {
    const status = req.params.status;
    try {
        let allOrders = await Orders.find({ status: status }).populate({
            path: 'custId',
            select: 'companyName name'
        })
            .sort({ date: -1 });
        res.status(200).json({ allOrders });
    }
    catch (error) {
        console.log(error);
    }
}

async function updateQuotation(req, res) {
    try {
        const { quotation, id, total } = req.body;
        await Orders.updateOne(
            { _id: id },
            { $set: { quotation: quotation, amount: total, status: "ready", date: new Date() } }
        ).then(() => res.status(200).json({ message: "quotation sent" }));
    }
    catch (error) {
        console.log(error);
    }
}

async function retrieveAdmin(req, res) {
    try {
        const { email, password } = req.body;
        const existingUser = await Admin.findOne({ email: email });

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
                res.status(201).json({ token });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function getAllCustomers(req, res) {
    try {
        const allcustomers = await Customers.find({});
        res.status(200).json({ allcustomers });
    }
    catch (error) {
        console.log(error);
    }
}

async function getCustomerOrdersByYear(req, res) {
    const year = req.params.year;
    console.log("here")
    const pipeline = [
        {
            $match: {
                date: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${Number(year) + 1}-01-01`)
                }
            }
        },
        {
            $group: {
                _id: "$custId",
                totalOrders: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "customers",
                localField: "_id",
                foreignField: "_id",
                as: "customer"
            }
        },
        {
            $unwind: "$customer"
        },
        {
            $project: {
                companyName: "$customer.companyName",
                totalOrders: 1
            }
        }
    ];

    try {
        const saleData = await Orders.aggregate(pipeline);
        res.status(200).json({ saleData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function updatePurchase(req, res) {
    const { orderId } = req.body;
    try {
        await Orders.updateOne(
            { _id: orderId },
            { $set: { status: "delivered", date: new Date() } }
        ).then(() => res.status(200).json({ message: "product delivered" }));
    }
    catch (error) {
        console.log(error)
    }
}

async function getPO(req, res) {
    const orderId = req.params.orderId;
    try {
        const order = await PurchaseOrder.findOne({ orderId: orderId });
        res.status(200).json({ order });
    }
    catch (error) {
        console.log(error);
    }
}

async function updatePayment(req, res) {
    console.log("HIT 3");
    const { id } = req.body;
    const payment = {
        orderId: id,
        razorpay_payment_id: req.body.razorpay_payment_id,
        razorpay_order_id: req.body.razorpay_order_id,
        razorpay_signature: req.body.razorpay_signature
    }
    try {
        await Orders.updateOne(
            { _id: id },
            { $set: { status: "paid" } }
        ).then(() => console.log("Saving Payment in DB"));
        const newPayment = new Payment(payment);
        await newPayment.save()
            .then(() => res.status(200).json({ msg: "payment saved in db" }))
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    getMonthlyOrderCounts,
    getSalesData,
    getAllOrders,
    updateQuotation,
    retrieveAdmin,
    getAllCustomers,
    getCustomerOrdersByYear,
    updatePurchase,
    getPO,
    updatePayment
}