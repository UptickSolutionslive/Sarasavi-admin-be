const JobModel = require("../models/job-model");
const ItemModel = require("../models/item-model");
const orderModel = require("../models/order-model");
const InvoiceService = require("../services/invoice-service");
const CustomerService = require("../services/customer-service");

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
      const job = await JobModel.findOne({ _id });
      const order_No = orderModel.length + 1;
      const order = new orderModel({
        order_No,
        job_id: job._id,
      });
      const orderResult = await order.save();
      if (!orderResult) {
        return { status: 400, error: "Error while saving order" };
      } else {
        reduceQuantity(job);
        const Invoice = await InvoiceService.createInvoice(job);
        const OrderedAmount = job.total - job.discount;
        const cusId = job.customer.customerId;
        const res = await CustomerService.updateOrderedAmount(cusId, OrderedAmount);
        if (Invoice.status === 200) {
          return {
            status: 200,
            message: "Job activated successfully",
            data: result,
          };
        } else {
          return {
            status: 400,
            message: "Error while activating job",
            data: null,
            error: result.error,
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

module.exports = {
  createJob,
  activateJob,
};
