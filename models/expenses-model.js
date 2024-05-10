const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const expenseSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    purpose: {
        type: String,
        enum: ['Electricity', 'WaterBill', 'Transport', 'Other'],
        required: true
    },
    other: {
        type: String,
        required: function() {
            return this.purpose === 'Other';
        }
    },
    amount: {
        type: Number,
        required: true
    }
});


const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
