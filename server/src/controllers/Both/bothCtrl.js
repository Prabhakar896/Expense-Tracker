const expressAsyncHandler = require("express-async-handler");
const Expense = require("../../model/Expense");
const Income = require("../../model/Income");
const { default: mongoose } = require("mongoose");

const TotalProfit = expressAsyncHandler(async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        // Aggregate Total Expenses
        const exp = await Expense.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, exptot: { $sum: { $toDouble: "$amount" } } } }
        ]);

        // Aggregate Total Income
        const inc = await Income.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, inctot: { $sum: { $toDouble: "$amount" } } } }
        ]);

        // Extract values safely
        const totalExpenses = exp.length > 0 ? exp[0].exptot : 0;
        const totalIncome = inc.length > 0 ? inc[0].inctot : 0;

        // Calculate Profit
        const totalProfit = totalIncome - totalExpenses;

        res.json({ totalProfit });
    } catch (error) {
        console.error("Error calculating profit:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = TotalProfit;
