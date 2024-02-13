const ReceiptModel = require('../models/receipt-model');
const OrderModel = require('../models/order-model');

async function createReceipt(receipt) {

    try {
        const newReceipt = new ReceiptModel(receipt);
        console.log(receipt.order);
        const Order = await OrderModel.findById(receipt.order);

        if (Order) {
            if (Order.total >= (Order.paid_amount + receipt.receipt_amount)) {
                if (Order.total === Order.paid_amount) {
                    return { status: 400, error: "This Order is already paid" };
                }
                Order.paid_amount = Order.paid_amount + receipt.receipt_amount;
                Order.save();
                const result = await newReceipt.save();
                if (result) {
                    return { status: 200, result };
                }
                else {
                    console.log("Error while saving receipt", result);
                    return { status: 400, error: "Error while saving receipt" };
                }
            }
            else {
                return { status: 400, error: "This Amount can't be charged" };
            }
        }


    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}
async function getReceipts() {
    try {
        const result = await ReceiptModel.find();
        return { status: 200, result };
    } catch (error) {
        return { status: 400, error };
    }
}


module.exports = {
    createReceipt,
    getReceipts,
}
