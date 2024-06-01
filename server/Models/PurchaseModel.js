const mongoose = require('mongoose');

const purchaseModelSchema = new mongoose.Schema({
    orderId: {type:mongoose.Schema.Types.ObjectId, ref:'Orders',required:true},
    address: {type:String, required:true},
    total: {type:Number, required:true},
    toolName :{type:String, required:true},
    tc:{type:String,required:true},
    date:{type:Date,default:new Date()},  
})

const PurchaseOrder = mongoose.model("PurchaseOrder",purchaseModelSchema);

module.exports = PurchaseOrder;