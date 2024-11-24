const mongoose = require('mongoose'); // Required for ObjectId conversion
const Job = require("../models/job-model"); // Adjust the path if necessary
const ExcelJS = require("exceljs");


exports.getActiveJobsExcel = async (req, res) => {
  try {
    const { customerId, month, year } = req.query;

    if (!customerId || !month || !year) {
      return res.status(400).json({ error: "Missing required query parameters: customerId, month, or year" });
    }

    // Convert customerId to ObjectId
    let customerObjectId;
    try {
      customerObjectId = new mongoose.Types.ObjectId(customerId);
    } catch (error) {
      return res.status(400).json({ error: "Invalid customerId format" });
    }

    // Define date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Find active jobs
    const jobs = await Job.find({
      isActive: true,
      "customer.customerId": customerObjectId,
      date: { $gte: startDate, $lte: endDate },
    });

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found for the given criteria." });
    }

    // Generate Excel file (same logic as before)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Active Jobs');
    worksheet.columns = [
        { header: 'Job No', key: 'job_No', width: 15 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Customer ID', key: 'customerId', width: 20 },
        { header: 'Customer Number', key: 'cNumber', width: 15 },
        { header: 'Customer Name', key: 'cName', width: 20 },
        { header: 'Item', key: 'item', width: 20 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Price', key: 'price', width: 10 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Remark', key: 'remark', width: 20 },
        { header: 'Created By', key: 'created_by', width: 20 },
        { header: 'Order Type', key: 'order_type', width: 15 },
        { header: 'Delivery Type', key: 'delivery_type', width: 15 },
        { header: 'Is Urgent', key: 'isUrgent', width: 10 },
        { header: 'Is Fast', key: 'isFast', width: 10 },
        { header: 'Additional Charges', key: 'additional_charges', width: 20 },
        { header: 'Discount', key: 'discount', width: 15 },
        { header: 'Delivery Charges', key: 'delivery_charges', width: 20 },
        { header: 'Paid Amount', key: 'paid_amount', width: 15 },
        { header: 'Designed By', key: 'designBy', width: 20 },
        { header: 'Is Active', key: 'isActive', width: 10 },
      ];
      

      jobs.forEach(job => {
        worksheet.addRow({
          job_No: job.job_No,
          name: job.name,
          date: job.date.toISOString().split('T')[0], // Formats date as YYYY-MM-DD
          customerId: job.customer.customerId,  // Added customerId field
          cNumber: job.customer.cNumber,        // Added customer phone number
          cName: job.customer.cName,            // Customer's name
          item: job.item.name,                  // Assuming the 'item' has a 'name' field (adjust accordingly)
          quantity: job.quantity,
          price: job.price,
          total: job.total,
          remark: job.remark || 'N/A',          // Default to 'N/A' if no remark is provided
          created_by: job.created_by || 'N/A',  // Default to 'N/A' if no creator info is provided
          order_type: job.order_type,
          delivery_type: job.delivery_type,
          isUrgent: job.isUrgent ? 'Yes' : 'No', // Convert boolean to readable string
          isFast: job.isFast ? 'Yes' : 'No',     // Convert boolean to readable string
          additional_charges: job.additional_charges || 0,  // Default to 0 if no additional charges
          discount: job.discount || 0,           // Default to 0 if no discount
          delivery_charges: job.delivery_charges || 0,  // Default to 0 if no delivery charges
          paid_amount: job.paid_amount || 0,     // Default to 0 if no paid amount
          designBy: job.designBy || 'N/A',       // Default to 'N/A' if no designer info is provided
          isActive: job.isActive ? 'Active' : 'Inactive',  // Convert boolean to readable string
        });
      });
      
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="ActiveJobs.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.status(200).end();

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
