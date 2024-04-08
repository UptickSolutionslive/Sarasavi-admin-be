const Invoice = require("../models/invoice-model");
const Order = require("../models/order-model");

async function getInvoiceByCuzAndDate(data) {
  try {
    const { customerId, dateType, date, startDate, endDate, month } = data;
    let ordersQuery = { "customer.customerId": customerId };
    let invoices = [];

    switch (dateType) {
      case "daily":
        const startOftheDay = new Date(date);
        startOftheDay.setHours(0, 0, 0, 0);
        const endOftheDay = new Date(date);
        endOftheDay.setHours(23, 59, 59, 999);
        ordersQuery.date = { $gte: startOftheDay, $lte: endOftheDay };
        break;
      case "monthly":
        const year = parseInt(month.substring(0, 4));
        const monthNumber = parseInt(month.substring(5)) - 1; // Months are 0-indexed
        const startOfMonth = new Date(year, monthNumber, 1); // Start of the month
        const endOfMonth = new Date(year, monthNumber + 1, 0); // End of the month
        ordersQuery.date = { $gte: startOfMonth, $lt: endOfMonth };

        break;
      case "range":
        ordersQuery.date = { $gte: startDate, $lte: endDate };
        break;
      default:
        throw new Error("Invalid dateType");
    }

    const orders = await Order.find(ordersQuery);

    for (let i = 0; i < orders.length; i++) {
      const invoice = await Invoice.find({ order_id: orders[i]._id });
      invoices = invoices.concat(invoice); // Flatten and concatenate
    }
    return { status: 200, invoices };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports = {
  getInvoiceByCuzAndDate,
};
