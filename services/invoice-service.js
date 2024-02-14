const InvoiceModel = require('../models/invoice-model');
const OrderModel = require('../models/order-model');

async function createInvoice(order) {

    try {
        const allInvoice = await InvoiceModel.find();
        const invoice = new InvoiceModel({
            invoice_no: "INV" + (allInvoice.length + 1),
            date: order.date,
            order_id: order._id,
            discount: 0,
        });
        const result = await invoice.save();
        if (!result) {
            return { status: 400, error: "Error while saving invoice" };
        }
        else {
            return { status: 200, result };
        }
    }
    catch (err) {
        console.log(err)
        return err;
    }
}

async function getAllInvoices() {
    try {
        const result = await InvoiceModel.find().populate('order_id').sort({createdAt:-1});
        if (!result) {
            return { status: 400, error: "Error while retrieving invoices" };
        }
        else {
            return { status: 200, result };
        }
    }
    catch (err) {
        return err;
    }
}
async function updateInvoice(req) {
    try {
        const invoice = await InvoiceModel.findOne({
            _id: req.params.id
        });
        const OrderId = invoice.order_id;
        if (invoice != null) {

            const result = await OrderModel.updateOne({
                _id: OrderId
            }, {
                discount: req.body.discount
            });
            if (result != null) {
                const result = await InvoiceModel.updateOne({
                    _id: req.params.id
                }, {
                    discount: req.body.discount,
                });
                if (result != null) {
                    return { status: 200, result };
                }
                else {
                    return { status: 400, error: "Error while updating invoice" };
                }
            }

        }

    }
    catch (err) {
        return err;
    }

}
module.exports = {
    createInvoice,
    getAllInvoices,
    updateInvoice,
}