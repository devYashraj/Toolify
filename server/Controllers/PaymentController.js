const { instance } = require('../utils')
const crypto = require('crypto')
async function checkout(req, res) {
    var options = {
        amount: Number(req.body.amount) * 100,
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function (err, order) {
        console.log(order);
        res.status(200).json({ order });
    });
}

async function verify(req, res) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const generated_signature = crypto
        .createHmac('sha256', process.env.RazorSecret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generated_signature == razorpay_signature) {
        console.log("Payment Verified");
        res.status(200).json({ status: "success" });
    }
    else {
        res.status(400)
    }
}

module.exports = { checkout, verify }