const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const customerSchema = new Schema({

    name : {
        type : String,
    },
    mobileNo : {
        type : String,
    },
    email : {
        type : String,
    },
    address : {
        type : String,
    },
    cPerson : {
        type : String,
    },
    cMobileNo : {
        type : String,
        required : true,
        unique: true,
    },
    remark : {
        type : String,
    },
    creditLimit : {
        type : Number,
    },
    ordered_amount :{
        type : Number,
    },
    paid_amount :{
        type : Number,
    },
    balance_amount :{
        type : Number,
    },
},{timestamps:true})

module.exports = mongoose.model("customer",customerSchema);