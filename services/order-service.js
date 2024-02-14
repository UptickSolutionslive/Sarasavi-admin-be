const OrderModel = require('../models/order-model');
const ItemModel = require('../models/item-model');
const InvoiceService = require('../services/invoice-service')
const SmsService = require('../services/sms-service')
const cron = require('node-cron');

async function createOrder(req, res) {
    try {
        const order = new OrderModel(req.body);
        const result = await order.save();
        if (!result) {
            return { status: 400, error: "Error while saving order" };
        }
        else {
            await reduceQuantity(req.body);
            const invoice = await InvoiceService.createInvoice(result);
            const sms = await SmsService.sendSms(req.body);
            if (invoice.status === 200) {
                return { status: 200, result };
            }
            else {
                return { status: 400, error: "Error while saving invoice" };
            }

        }
    }
    catch (err) {
        console.log(err)
        return err;
    }
}
async function getAllOrders(req, res) {
    try {
        const result = await OrderModel.find().sort({ cretedAt: -1 });
        return { status: 200, result };
    }
    catch (err) {
        return err;
    }

}

async function reduceQuantity(order) {
    try {
        const Item = await ItemModel.findOne({
            _id: order.item
        });
        const result = await ItemModel.updateOne({
            _id: order.item
        }, { available_quantity: Item.available_quantity - order.quantity });
        if (!result) {
            return { status: 400, error: "Error while reducing quantity" };
        }
        return { status: 200, result };

    }
    catch (err) {
        return err; f
    }
}
async function startPaymentCheckCronJob() {
    cron.schedule('*/1 * * * *', async () => {
        try {
            const orders = await OrderModel.find();
            for (const order of orders) {
                if (order.total === order.paid_amount && !order.isCompleted) {
                    order.isCompleted = true;
                    await order.save();
                }
            }
            console.log('Payment check completed.');
        } catch (err) {
            console.error('Error occurred while checking payments:', err);
        }
    });
}


module.exports = {
    createOrder,
    getAllOrders,
    startPaymentCheckCronJob,
}