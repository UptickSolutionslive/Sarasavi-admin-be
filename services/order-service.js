const OrderModel = require('../models/order-model');
const ItemModel = require('../models/item-model');
const InvoiceService = require('../services/invoice-service')
const SmsService = require('../services/sms-service');
const orderModel = require('../models/order-model');

async function createOrder(req, res) {
    console.log(req);
    try {
        const order = new OrderModel(req.body);
        console.log(req.body);
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
        const result = await OrderModel.find().sort({ order_No:1 });
        return { status: 200, result };
    }
    catch (err) {
        return err;
    }

}

async function getDeactivateJobs() {
    try {
        const result = await OrderModel.find({isActive:false}).sort({createdAt:-1},);
        if (result) {
            return { status: 200, message: "Jobs fetched successfully", data: result };
        }
        else {
            return { status: 400, message: "Error while fetching job", data: null, error: result.error };
        }

    } catch (err) {
        return { status: 500, message: `Error while fetching job ${err}`, error: err };
    }
}

async function getActiveJobs() {
    try {
        const result = await OrderModel.find({isActive:true}).sort({order_No:1},);
        if (result) {
            return { status: 200, message: "Jobs fetched successfully", data: result };
        }
        else {
            return { status: 400, message: "Error while fetching job", data: null, error: result.error };
        }

    } catch (err) {
        return { status: 500, message: `Error while fetching job ${err}`, error: err };
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

async function activateJob(req){
    let jobId = req.params.id;
    const {isActive} = req.body;

    const activate = {isActive}

    try{
        const result = await OrderModel.findByIdAndUpdate(jobId, activate);

        if(result){
            return {status:200,message:"Job Activates successfully",data:result};
        }else{
            return {status:400,message:"Error while fetching Job",data:null,error:result.error};
        }
    }catch(err){
        return { status: 500, message: `Error while updating Job ${err}`, error: err };
    }
}

async function deleteOrder(req) {
    let userId = req.params.id;
    const result = await orderModel.findByIdAndDelete(userId);

    try {
        if(result){
            return {status:200,message:"Order deleted successfully",data:result};
        }else{
            return {status:400,message:"Error while deleting order",data:null,error:result.error};
        }
    } catch (err) {
        return { status: 500, message: `Error while deleting order ${err}`, error: err };
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    activateJob,
    getActiveJobs,
    getDeactivateJobs,
    deleteOrder
}