require("dotenv").config(); // Ensure dotenv is configured globally

const Expense = require("../../model/Expense");
const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/User");
const mongoose = require("mongoose");

// Create Expense
const createExpCtrl = expressAsyncHandler(async (req, res) => {
  const { title, amount, description } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const expense = await Expense.create({ title, amount, description, user: userId });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Error creating expense", error: err.message });
  }
});

// Fetch All Expenses (with Pagination)
const fetchAllExpCtrl = expressAsyncHandler(async (req, res) => {
  const { page = 1 } = req.query; // Default to page 1
  const userId = req.user.id;

  try {
    const expense = await Expense.paginate(
      { user: userId },
      { limit: 15, page: Number(page), populate: "user" }
    );

    res.json({
      expense: expense.docs || [],
      totalPages: expense.totalPages,
      currentPage: expense.page,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses", error: err.message });
  }
});

// Fetch Expense Details
const fetchExpDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expense details", error: err.message });
  }
});

// Update Expense
const updateExpCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, amount, description } = req.body;

  try {
    const expense = await Expense.findByIdAndUpdate(
      id,
      { title, description, amount },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Error updating expense", error: err.message });
  }
});

// Delete Expense
const deleteExpCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expense", error: err.message });
  }
});

// Get Total Expense
const getTotalExpense = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const totalExpense = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } },
    ]);

    res.json({ success: true, totalExpense: totalExpense.length > 0 ? totalExpense[0].total : 0 });
  } catch (err) {
    res.status(500).json({ message: "Error fetching total expense", error: err.message });
  }
});

// Get Expense Summary
const getExpenseSummary = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const summary = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: { $toDouble: "$amount" } },
          minExpense: { $min: { $toDouble: "$amount" } },
          maxExpense: { $max: { $toDouble: "$amount" } },
          avgExpense: { $avg: { $toDouble: "$amount" } },
        },
      },
    ]);

    res.json(summary.length > 0 ? summary[0] : {
      totalExpenses: 0,
      minExpense: 0,
      maxExpense: 0,
      avgExpense: 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching expense summary", error: err.message });
  }
});

// ✅ Corrected Export
module.exports = {
  createExpCtrl,
  fetchAllExpCtrl,
  fetchExpDetailsCtrl,
  updateExpCtrl,
  deleteExpCtrl,
  getTotalExpense,
  getExpenseSummary
};
