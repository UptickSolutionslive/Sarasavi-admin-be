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
    OrderedAmount : {
        type : Number,
    },
    paidAmount : {
        type : Number,
    },
    balance : {
        type : Number,
    },

},{timestamps:true})

module.exports = mongoose.model("customer",customerSchema);