const express = require('express');
const  TotalProfit = require('../../controllers/Both/bothCtrl');
const {authMiddleware} = require('../../middlewares/authMiddleware');
const mongoose=require('mongoose')
const BothRouter=express.Router();
const Expense = require('../../model/Expense')
const Income = require('../../model/Income')
BothRouter.get('/pro',authMiddleware,TotalProfit)
// In your Express route for expenses
BothRouter.get("/summary/exp/:userId", authMiddleware, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId);
        const expenses = await Expense.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, totalExpenses: { $sum: { $toDouble: "$amount" } } } }
        ]);
        res.json(expenses[0] || { totalExpenses: 0 });
    } catch (error) {
        console.error("Error fetching expense summary:", error);
        res.status(500).json({ message: "Error fetching expense data" });
    }
});

// In your Express route for income (similar for income)
BothRouter.get("/summary/inc/:userId",authMiddleware, async (req, res) => {
    try {
        const income = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.params.userId) } },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: { $toDouble: "$amount" } },
                },
            },
        ]);
        res.json(income[0] || { totalIncome: 0 });
    } catch (error) {
        res.status(500).json({ message: "Error fetching income data" });
    }
});

module.exports=BothRouter