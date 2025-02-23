const Income = require("../../model/Income");
const expressAsyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// ✅ Create Income
const createIncCtrl = expressAsyncHandler(async (req, res) => {
    console.log("Request received:", req.body);
    const { title, amount, description } = req.body;
    const userId = req.user?._id; 

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const income = await Income.create({ title, amount, description, user: userId });
        return res.status(201).json(income);  
    } catch (err) {
        console.error("Error in createIncCtrl:", err);
        res.status(500).json({ message: "Failed to add income" });
    }
});

// ✅ Fetch All Income (Paginated)
const fetchAllIncCtrl = expressAsyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const userId = req.user?.id; 

    try {
        const income = await Income.paginate(
            { user: userId }, 
            { limit: 15, page: Number(page), populate: "user" }
        );

        res.json({
            incomes: income.docs,
            totalPages: income.totalPages,
            currentPage: income.page,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching incomes", error: err.message });
    }
});

// ✅ Fetch Income Details by ID
const fetchIncDetailsCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Income ID" });
    }

    try {
        const income = await Income.findById(id);
        if (!income) return res.status(404).json({ message: "Income not found" });

        res.json(income);
    } catch (err) {
        res.status(500).json({ message: "Error fetching income details", error: err.message });
    }
});

// ✅ Update Income
const updateIncCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, amount, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Income ID" });
    }

    try {
        const income = await Income.findByIdAndUpdate(id, { title, amount, description }, { new: true });
        if (!income) return res.status(404).json({ message: "Income not found" });

        res.json(income);
    } catch (err) {
        res.status(500).json({ message: "Error updating income", error: err.message });
    }
});

// ✅ Delete Income
const deleteIncCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Income ID" });
    }

    try {
        const income = await Income.findByIdAndDelete(id);
        if (!income) return res.status(404).json({ message: "Income not found" });

        res.json({ message: "Income deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting income", error: err.message });
    }
});

// ✅ Get Total Income for User
const getTotalIncome = expressAsyncHandler(async (req, res) => {
    const { id: userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try {
        const totalIncome = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } }, 
            { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
        ]);

        res.status(200).json({
            success: true,
            totalIncome: totalIncome.length > 0 ? totalIncome[0].total : 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching total income",
            error: error.message
        });
    }
});

// ✅ Get Income Summary (Min, Max, Avg, Total)
const getIncomeSummary = expressAsyncHandler(async (req, res) => {
    const { id: userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try {
        const summary = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: { $toDouble: "$amount" } },
                    minIncome: { $min: { $toDouble: "$amount" } },
                    maxIncome: { $max: { $toDouble: "$amount" } },
                    avgIncome: { $avg: { $toDouble: "$amount" } },
                },
            },
        ]);

        res.json(summary.length > 0 ? summary[0] : {
            totalIncome: 0,
            minIncome: 0,
            maxIncome: 0,
            avgIncome: 0,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching income summary", error: err.message });
    }
});

module.exports = {
    createIncCtrl,
    fetchAllIncCtrl,
    fetchIncDetailsCtrl,
    updateIncCtrl,
    deleteIncCtrl,
    getTotalIncome,
    getIncomeSummary
};
