const JobModel = require("../models/job-model");
const ItemModel = require("../models/item-model");
const orderModel = require("../models/order-model");
const InvoiceService = require("../services/invoice-service");
const CustomerService = require("../services/customer-service");
const OrderService = require("../services/order-service");

async function createJob(req, res) {
  try {
    const lastJob = await JobModel.findOne().sort({ createdAt: -1 });

    let newJobNo = 1;

    if (lastJob) {
      console.log(lastJob.job_No);
      // If there is a last job, extract the numeric part of the job number
      const lastJobNo = lastJob.job_No.match(/\d+$/)[0];

      // Increment the numeric part
      const newJobNoNumeric = parseInt(lastJobNo) + 1;
      // Construct the new job number by concatenating the prefix with the incremented numeric part
      const prefix = lastJob.job_No.replace(lastJobNo, "");
      newJobNo = `${prefix}${newJobNoNumeric}`;
    }

    // Now, newJobNo holds the new job number
    req.body.job_No = newJobNo;

    const job = new JobModel(req.body);
    const result = await job.save();
    if (!result) {
      return { status: 400, error: "Error while saving job" };
    } else {
      return { status: 200, result };
    }
  } catch (err) {
    console.log(err);
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
      if (activate) {
        const SavedOrder = await OrderService.createOrder(job);
        if (SavedOrder.status === 200) {
          return {
            status: 200,
            message: "Job activated successfully",
            data: result,
          };
        }
      } else {
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

async function deleteJob(req, res) {
  try {
    const jobId = req.params.id;
    const job = await JobModel.findOne({ _id: jobId });
    if (job.isActive) {
      return { status: 400, error: "Job is active, cannot delete" };
    } else {
      const result = await JobModel.findByIdAndDelete(jobId);
      if (!result) {
        return { status: 400, error: "Error while deleting job" };
      } else {
        return { status: 200, result };
      }
    }
  } catch (err) {
    return err;
  }
}

async function updateJob(req, res) {
  try {
    const jobId = req.params.id;
    const updates = req.body;
    const result = await JobModel.findByIdAndUpdate(jobId, updates, {
      new: true,
    });
    if (result) {
      return { status: 200, result, message: "Job Updated Successfully" };
    } else {
      return { status: 400, error: "Error while updating job" };
    }
  } catch (err) {
    return err;
  }
}

module.exports = {
  createJob,
  activateJob,
  getJobs,
  deleteJob,
  updateJob,
};
