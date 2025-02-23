const express=require('express');
const { fetchExpDetailsCtrl,createExpCtrl, fetchAllExpCtrl, updateExpCtrl, deleteExpCtrl,getTotalExpense, getExpenseSummary } = require('../../controllers/expenses/expenseCtrl');
const {authMiddleware} = require('../../middlewares/authMiddleware');
const expenseRoute=express.Router();
expenseRoute.post('/spec',authMiddleware,createExpCtrl)
expenseRoute.get('/spec',authMiddleware,fetchAllExpCtrl)
expenseRoute.get('/:id',authMiddleware,fetchExpDetailsCtrl)
expenseRoute.put('/:id',authMiddleware,updateExpCtrl)
expenseRoute.delete('/:id',authMiddleware,deleteExpCtrl)
expenseRoute.get('/total/:id',authMiddleware,getTotalExpense)
expenseRoute.get('/summary/:id',authMiddleware,getExpenseSummary)

module.exports=expenseRoute;