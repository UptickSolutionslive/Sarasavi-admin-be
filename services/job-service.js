const JobModel = require("../models/job-model");
const ItemModel = require("../models/item-model");
const orderModel = require("../models/order-model");
const InvoiceService = require("../services/invoice-service");
const CustomerService = require("../services/customer-service");
const OrderService = require("../services/order-service");
const WastedJobModel = require("../models/wastedJob-model");
const wastedJobModel = require("../models/wastedJob-model");
var GrnService = require("../services/grn-service");
const mongoose = require("mongoose");

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
      newJobNo = newJobNoNumeric;
    }

    // Now, newJobNo holds the new job number
    req.body.job_No = newJobNo;
    req.body._id = new mongoose.Types.ObjectId();

    const job = new JobModel(req.body);
    const result = await job.save();
    if (!result) {
      return { status: 400, error: "Error while saving job" };
    } else {
      const updatedItem = await reduceQuantity(result);
      if (updatedItem.status === 200) {
        return { status: 200, result, message: "Job Created Successfully" };
      } else {
        return {
          status: 400,
          error: "Error while reducing quantity",
          data: updatedItem.error,
        };
      }
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
    const updateItemQuantity = await updateQuantity(jobId);
    if (updateItemQuantity.status === 200) {
      const updates = req.body;
      const result = await JobModel.findByIdAndUpdate(jobId, updates, {
        new: true,
      });
      const updatedItem = await reduceQuantity(result);
      if (updatedItem.status === 200) {
        return { status: 200, result, message: "Job Updated Successfully" };
      } else {
        return {
          status: 400,
          error: "Error while reducing quantity",
          data: updatedItem.error,
        };
      }
    }
  } catch (err) {
    return err;
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
  }
}

async function updateQuantity(jobId) {
  const exJob = await JobModel.findById(jobId);
  const exItem = await ItemModel.findById(exJob.item);
  const result = await ItemModel.updateOne(
    {
      _id: exJob.item,
    },
    { available_quantity: exItem.available_quantity + exJob.quantity }
  );
  if (!result) {
    return { status: 400, error: "Error while updating quantity" };
  }
  return { status: 200, result };
}

async function saveWastedJob(req) {
  console.log(req.body);
  console.log(req.body.items);
  const wastedJob = new WastedJobModel(req.body);
  const result = await wastedJob.save();
  if (!result) {
    return { status: 400, error: "Error while saving wasted job" };
  }
  return { status: 200, result };
}

async function getWastedJobs(req, res) {
  try {
    const result = await WastedJobModel.find().sort({ createdAt: -1 });
    return { status: 200, result };
  } catch (error) {
    return { status: 400, error };
  }
}

async function deleteWastedJob(req, res) {
  try {
    const jobId = req.params.id;
    const result = await WastedJobModel.findByIdAndDelete(jobId);
    if (!result) {
      return { status: 400, error: "Error while deleting wasted job" };
    } else {
      return { status: 200, result };
    }
  } catch (err) {
    return err;
  }
}

async function approveWastedJob(req, res) {
  try {
    console.log(req.params.id);
    const jobId = req.params.id;
    const record = await WastedJobModel.findOne({ _id: jobId });
    console.log(record);

    const updateQuantity = await GrnService.reduceQuantity(record);

    console.log(updateQuantity);
    if (updateQuantity.status === 200) {
      record.isAccepted = true;
      const result = await record.save();
      if (!result) {
        return { status: 400, error: "Error while approving wasted job" };
      } else {
        return { status: 200, result };
      }
    }
  } catch (err) {
    return err;
  }
}
async function generateActiveJobsExcel(req, res) {
  try {
    // Extract filters from request query
    const { month, year, customerId } = req.query;

    // Validate the inputs
    if (!month || !year || !customerId) {
      return res.status(400).send("Month, year, and customer ID are required.");
    }

    // Fetch active jobs for the specified customer and date range
    const startDate = new Date(year, month - 1, 1); // Start of the month
    const endDate = new Date(year, month, 0); // End of the month

    const jobs = await JobModel.find({
      isActive: true,
      "customer.customerId": customerId,
      date: { $gte: startDate, $lte: endDate },
    });

    if (jobs.length === 0) {
      return res.status(404).send("No active jobs found for the specified criteria.");
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Active Jobs");

    // Define columns for the Excel sheet
    worksheet.columns = [
      { header: "Job No", key: "job_No", width: 15 },
      { header: "Name", key: "name", width: 25 },
      { header: "Customer Name", key: "customerName", width: 25 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Price", key: "price", width: 10 },
      { header: "Total", key: "total", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];

    // Add data rows to the worksheet
    jobs.forEach((job) => {
      worksheet.addRow({
        job_No: job.job_No,
        name: job.name,
        customerName: job.customer.cName,
        quantity: job.quantity,
        price: job.price,
        total: job.total,
        date: job.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      });
    });

    // Set response headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=active_jobs.xlsx");

    // Write the Excel file to the response
    await workbook.xlsx.write(res);

    // End the response
    res.status(200).end();
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Error generating Excel file.");
  }
}

module.exports = {
  createJob,
  activateJob,
  getJobs,
  deleteJob,
  updateJob,
  saveWastedJob,
  getWastedJobs,
  deleteWastedJob,
  approveWastedJob,
  generateActiveJobsExcel
};
