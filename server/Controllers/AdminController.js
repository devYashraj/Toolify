const Orders = require('../Models/OrderModel')
const Admin = require('../Models/AdminModel')
const Customers = require('../Models/CustomerModel')
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
                $expr: { $eq: [{ $year: "$date" }, currentYear] }
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
                $expr: { $eq: [{ $month: "$date" }, currentMonth] }
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
        const saleData = {
            year: currentYearTotal[0].totalAmount,
            month: currentMonthTotal[0].totalAmount
        }
        res.status(200).json({ saleData });
    }
    catch (error) {
        console.log(error);
    }
}

async function getAllOrders(req, res) {
    try {
        const allOrders = await Orders.find({}).populate({
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
            { $set: { quotation: quotation, amount: total } }
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

async function getAllCustomers(req,res){
    try {
        const allcustomers = await Customers.find({});
        res.status(200).json({ allcustomers });
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    getMonthlyOrderCounts,
    getSalesData,
    getAllOrders,
    updateQuotation,
    retrieveAdmin,
    getAllCustomers   
}