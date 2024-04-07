const Invoice = require("../models/invoice-model");
const Order = require("../models/order-model");

async function getInvoiceByCuzAndDate(data) {
  try {
    console.log(data);
    const cuzId = data.customerId;
    const dateType = data.dateType;
    const date = data.date;
    const startDate = data.startDate;
    const endDate = data.endDate;
    const month = data.month;
    const invoices = [];

    if (dateType === "daily") {
      const orders = await Order.find({
        "customer.customerId": cuzId,
        date: date,
      });
      for (let i = 0; i < orders.length; i++) {
        const invoice = await Invoice.find({
          order_id: orders[i]._id,
        });
        invoices.push(invoice);
      }
    }
    if (dateType === "monthly") {
      const orders = await Order.find({
        "customer.customerId": cuzId,
        date: { $regex: month },
      });
      for (let i = 0; i < orders.length; i++) {
        const invoice = await Invoice.find({
          order_id: orders[i]._id,
        });
        invoices.push(invoice);
      }
    }
    if (dateType === "range") {
      console.log("here");

      const orders = await Order.find({
        "customer.customerId": cuzId,
        date: { $gte: startDate, $lte: endDate },
      });
      for (let i = 0; i < orders.length; i++) {
        const invoice = await Invoice.find({
          order_id: orders[i]._id,
        });
        invoices.push(invoice);
      }
    }
    console.log(invoices);
    return { status: 200, invoices };
    // const invoices = await Invoice.find({
    //   order_id: { $in: orders.map((order) => order._id) },
    // })
    // return invoices;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports = {
  getInvoiceByCuzAndDate,
};
