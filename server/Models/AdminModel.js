const mongoose = require('mongoose');

const AdminModel = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

const Admin = mongoose.model("Admin", AdminModel);

module.exports = Admin;