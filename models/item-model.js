const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    dimension: {
        length: {
            type: Number,
            default: 0,
        },
        width: {
            type: Number,
            default: 0,
        },
        height: {
            type: Number,
            default: 0,
        },
    },
    starting_quantity: {
        type: Number,
        default: 0,
    },
    available_quantity: {
        type: Number,
        default: 0,
    },
    minimum_quantity: {
        type: Number,
        default: 0,
    },
    remark: {
        type: String,
    },
    initial_cost: {
        type: Number,
        default: 0,
    },
    default_price: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("item", itemSchema);