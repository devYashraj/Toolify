const mongoose = require('mongoose');

const CustomerModel = new mongoose.Schema({
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phno: { type: String, required: true },
    password: { type: String, required: true },
})

const Customer = mongoose.model("Customer", CustomerModel);

module.exports = Customer;