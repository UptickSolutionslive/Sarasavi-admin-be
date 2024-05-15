const Expense = require('../models/expenses-model');

async function addExpense(date, purpose, other, amount) {
  try {
      let newExpenseData = { date, purpose, amount };
      if (purpose === 'Other') {
          if (!other) {
              throw new Error("Other field is required for purpose 'Other'");
          }
          newExpenseData.other = other;
      }
      const newExpense = new Expense(newExpenseData);
      const result = await newExpense.save();
      if (!result) {
          throw new Error(`Failed to add expense`);
      }
      return { status: 200, message: `Expense added successfully.` };
  } catch (err) {
      console.error("Error adding expense:", err);
      return { status: 500, error: err.message };
  }
}

async function getAllExpenses() {
    try {
        const expenses = await Expense.find();
        return { status: 200, expenses };
    } catch (error) {
        console.error("Error getting all expenses:", error);
        return { status: 500, error: error.message };
    }
}

async function updateExpenseById(expenseId, updates) {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updates, { new: true });
        if (!updatedExpense) {
            throw new Error(`Expense with ID '${expenseId}' not found`);
        }
        return { status: 200, message: `Expense with ID '${expenseId}' updated successfully`, expense: updatedExpense };
    } catch (error) {
        console.error("Error updating expense:", error);
        return { status: 500, error: "Error updating expense" };
    }
}

async function deleteExpenseById(expenseId) {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(expenseId);
        if (!deletedExpense) {
            throw new Error(`Expense with ID '${expenseId}' not found`);
        }
        return { status: 200, message: `Expense with ID '${expenseId}' deleted successfully` };
    } catch (error) {
        console.error("Error deleting expense:", error);
        return { status: 500, error: error.message };
    }
}

module.exports = {
    addExpense,
    getAllExpenses,
    updateExpenseById,
    deleteExpenseById
};
