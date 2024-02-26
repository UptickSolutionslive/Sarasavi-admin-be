const JobModel = require("../models/job-model");
const ItemModel = require("../models/item-model");
const orderModel = require("../models/order-model");
const InvoiceService = require("../services/invoice-service");
const CustomerService = require("../services/customer-service");
const OrderService = require("../services/order-service");

async function createJob(req, res) {
  try {
    const job = new JobModel(req.body);
    const result = await job.save();
    if (!result) {
      return { status: 400, error: "Error while saving job" };
    } else {
      return { status: 200, result };
    }
  } catch (err) {
    return err;
  }
}
async function activateJob(req) {
  let jobId = req.params.id;
  const { isActive } = req.body;
  const activate = { isActive };
  try {
    const result = await JobModel.findByIdAndUpdate(jobId, activate);
    if (result) {
      const job = await JobModel.findOne({ _id: jobId });
      if(activate){
        const SavedOrder = await OrderService.createOrder(job);
        if (SavedOrder.status === 200) {
          return {
            status: 200,
            message: "Job activated successfully",
            data: result,
          };
        }
      }
      else{
        const deletedOrder = await OrderService.deleteOrderByJobId(jobId);
        if (deletedOrder.status === 200) {
          return {
            status: 200,
            message: "Job deactivated successfully",
            data: result,
          };
        }
      }
      
    } else {
      return {
        status: 400,
        message: "Error while activating job",
        data: null,
        error: result.error,
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: `Error while updating Job ${err}`,
      error: err,
    };
  }
}

async function reduceQuantity(order) {
  try {
    const Item = await ItemModel.findOne({
      _id: order.item,
    });
    const result = await ItemModel.updateOne(
      {
        _id: order.item,
      },
      { available_quantity: Item.available_quantity - order.quantity }
    );
    if (!result) {
      return { status: 400, error: "Error while reducing quantity" };
    }
    return { status: 200, result };
  } catch (err) {
    return err;
    f;
  }
}
async function getJobs(req, res) {
  try {
    const result = await JobModel.find().sort({ createdAt: -1 });
    return { status: 200, result };
  } catch (error) {
    return { status: 400, error };
  }
}

module.exports = {
  createJob,
  activateJob,
  getJobs,
};
