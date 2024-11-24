const mongoose = require('mongoose');
const InvoiceModel = require("../models/invoice-model");
const OrderModel = require("../models/order-model");
const JobModel = require("../models/job-model");
const { v4: uuidv4 } = require('uuid');

// Function to generate the next invoice number
async function generateNextInvoiceNumber() {
  try {
    // Find the latest invoice by sorting in descending order and limiting to 1
    const latestInvoice = await InvoiceModel.findOne().sort({ invoice_no: -1 });

    if (!latestInvoice) {
      // If no invoices exist, start with INV10000
      return 'INV10000';
    }

    // Extract the numeric part of the invoice_no (after "INV")
    const currentInvoiceNo = latestInvoice.invoice_no;
    const match = currentInvoiceNo.match(/^INV(\d+)$/);

    if (!match) {
      // If the format is incorrect, throw an error
      throw new Error('Invalid invoice number format');
    }

    // Extract the numeric part from the match (index 1 contains the number)
    const numericPart = parseInt(match[1], 10);

    if (isNaN(numericPart)) {
      throw new Error('Invalid invoice number format');
    }

    // Increment the number by 1
    const nextNumericPart = numericPart + 1;

    // Generate the new invoice_no with the "INV" prefix
    const nextInvoiceNo = `INV${nextNumericPart}`;

    return nextInvoiceNo;

  } catch (error) {
    console.error('Error generating invoice number:', error);
    throw new Error('Unable to generate the next invoice number');
  }
}


async function createInvoice(order) {
  try {
    // Generate the next invoice number
    const invoice_no = await generateNextInvoiceNumber();

    // Create the invoice document
    const invoice = new InvoiceModel({
      invoice_no: invoice_no,  // Using the generated invoice number
      date: order.date,
      order_id: order._id,
      discount: 0,
      delivery_charges: 0,
      total: order.total,
      paidAmount: 0,
      balance: order.total,
      isCompleted: false,
    });

    // Save the invoice to the database
    const result = await invoice.save();
    if (!result) {
      return { status: 400, error: "Error while saving invoice" };
    } else {
      return { status: 200, result };
    }
  } catch (err) {
    console.log(err);
    return { status: 400, error: err.message || err };
  }
}

async function getAllInvoices() {
  try {
    const result = await InvoiceModel.find()
      .populate("order_id")
      .sort({ createdAt: -1 });
    if (!result) {
      return { status: 400, error: "Error while retrieving invoices" };
    } else {
      return { status: 200, result };
    }
  } catch (err) {
    return err;
  }
}

async function updateDeliveryAndDiscount(req) {
  try {
    const invoice = await InvoiceModel.findOne({
      _id: req.params.id,
    });

    const OrderId = invoice.order_id;
    const order = await OrderModel.findOne({
      _id: OrderId,
    });
    const job = await JobModel.findOne({
      _id: order.job_id,
    });
    if (invoice != null) {
      const result = await OrderModel.updateOne(
        {
          _id: OrderId,
        },
        {
          discount: req.body.discount,
          delivery_charges: req.body.delivery_charges,
        }
      );

      const res = await JobModel.updateOne(
        {
          _id: order.job_id,
        },
        {
          discount: req.body.discount,
          delivery_charges: req.body.delivery_charges,
        }
      );

      if (result != null) {
        const result = await InvoiceModel.updateOne(
          {
            _id: req.params.id,
          },
          {
            discount: req.body.discount,
            delivery_charges: req.body.delivery_charges,
            total: order.total - parseInt(req.body.discount) + parseInt(req.body.delivery_charges),
            balance:
            order.total - parseInt(req.body.discount) + parseInt(req.body.delivery_charges),
          }
        );
        if (result != null) {
          return { status: 200, result };
        } else {
          return { status: 400, error: "Error while updating invoice" };
        }
      }
    }
  } catch (err) {
    return err;
  }
}

async function getInvoiceByCustomerId(customerId) {
  try {
    const OrderList = await OrderModel.find({
      "customer.customerId": customerId,
    });

    const invoiceList = [];
    if (OrderList.length == 0) {
      return { status: 200, invoiceList };
    }
    for (let i = 0; i < OrderList.length; i++) {
      const invoice = await InvoiceModel.findOne({
        order_id: OrderList[i]._id,
        isCompleted: false,
      });
      if (invoice != null) {
        invoiceList.push(invoice);
      }
    }
    if (invoiceList.length > 0) {
      return { status: 200, invoiceList };
    } else {
      return { status: 200, invoiceList };
    }
  } catch (err) {
    return err;
  }
}

async function updateInvoice(invoice) {
  try {
    console.log("invoice", invoice.length);
    for (let i = 0; i < invoice.length; i++) {
      const exInvoice = await InvoiceModel.findById(invoice[i].inv_id);
      const res = await InvoiceModel.findByIdAndUpdate(invoice[i].inv_id, {
        paidAmount: exInvoice.paidAmount + invoice[i].paidAmount,
        balance: exInvoice.balance - invoice[i].paidAmount,
        isCompleted:
          exInvoice.total === invoice[i].paidAmount ||
          exInvoice.balance === invoice[i].paidAmount
            ? true
            : false,
      });
      if (!res) {
        return { status: 400, error: "Error while updating invoice" };
      }
    }
    return { status: 200, message: "Invoices updated successfully" };
  } catch (err) {
    return { status: 400, error: err.message || err };
  }
}

module.exports = {
  createInvoice,
  getAllInvoices,
  updateDeliveryAndDiscount,
  getInvoiceByCustomerId,
  updateInvoice,
};
