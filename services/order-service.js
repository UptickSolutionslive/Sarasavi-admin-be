const OrderModel = require('../models/order-model');
const ItemModel = require('../models/item-model');

async function createOrder(req, res) {
    try {
        const order = new OrderModel(req.body);
        const result = await order.save();
        if (!result) {
            return { status: 400, error: "Error while saving order" };
        }
        await reduceQuantity(req.body);
        return { status: 200, result };
    }
    catch (err) {
        console.log(err)
        return err;
    }
}
async function getAllOrders(req, res) {
    try {
        const result = await OrderModel.find().sort({ date: 1 });   
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

module.exports = {
    createOrder,
    getAllOrders,
}