const { startOfDay, endOfDay, startOfMonth, endOfMonth, parseISO } = require('date-fns');
const Invoice = require("../models/invoice-model");
const Order = require("../models/order-model");

function toLocalDate(date) {
  return new Date(date);
}

async function getInvoiceByCuzAndDate(data) {
  try {
    const { customerId, dateType, date, startDate, endDate, month } = data;
    let ordersQuery = { "customer.customerId": customerId };
    let invoices = [];

    switch (dateType) {
      case "daily":
        const parsedDate = parseISO(date);
        const startOfDayDate = startOfDay(toLocalDate(parsedDate));
        console.log(startOfDayDate);
        const endOfDayDate = endOfDay(toLocalDate(parsedDate));
        console.log(endOfDayDate);
        ordersQuery.date = { $gte: startOfDayDate, $lte: endOfDayDate };
        break;
      case "monthly":
        const year = parseInt(month.substring(0, 4));
        const monthNumber = parseInt(month.substring(5)) - 1; // Months are 0-indexed
        const startOfMonthDate = startOfMonth(new Date(year, monthNumber, 1));
        const endOfMonthDate = endOfMonth(new Date(year, monthNumber, 1));
        ordersQuery.date = { $gte: startOfMonthDate, $lte: endOfMonthDate };
        break;
      case "range":
        const parsedStartDate = parseISO(startDate);
        const parsedEndDate = parseISO(endDate);
        const startRangeDate = startOfDay(toLocalDate(parsedStartDate));
        const endRangeDate = endOfDay(toLocalDate(parsedEndDate));
        ordersQuery.date = { $gte: startRangeDate, $lte: endRangeDate };
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
