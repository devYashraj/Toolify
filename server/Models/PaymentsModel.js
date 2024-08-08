const mongoose = require('mongoose')

const PaymentsSchema = new mongoose.Schema({
    orderId: {type:mongoose.Schema.Types.ObjectId, ref:'Orders',required:true}, 
    razorpay_payment_id: { type: String, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
})

const Payment = mongoose.model("Payment", PaymentsSchema);

module.exports = Payment