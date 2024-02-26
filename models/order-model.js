const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_No: {
        type: String,
        required: true,
        unique: true,
    },
    job_id :{
        type: Schema.Types.ObjectId,
        ref: 'job',
        required: true,
    }

});

module.exports = mongoose.model("order", orderSchema);