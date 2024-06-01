const mongoose = require('mongoose');


const quotationSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true }
},{ _id: false })

const orderSchema = new mongoose.Schema({
    toolName: { type: String, required: true },
    custId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    address: { type: String, required: true },
    date: { type: Date, required: true },
    filepath: { type: String, required: true },
    quotation: { type: [quotationSchema], default: [{ itemName: "empty", qty: 0, price: 0 }] },
    amount: { type: Number, default: 0 },
    status: {type:String, default:"pending"}
})

const Orders = mongoose.model("Orders", orderSchema)

module.exports = Orders;