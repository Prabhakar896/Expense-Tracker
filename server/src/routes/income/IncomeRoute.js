const express=require('express');
const { fetchIncDetailsCtrl,createIncCtrl, fetchAllIncCtrl, updateIncCtrl, deleteIncCtrl, getTotalIncome ,getIncomeSummary} = require('../../controllers/income/incomeCtrl');
const {authMiddleware} = require('../../middlewares/authMiddleware');
const incomeRoute=express.Router();
incomeRoute.post('/spec',authMiddleware,createIncCtrl)
incomeRoute.get('/spec',authMiddleware,fetchAllIncCtrl)
incomeRoute.get('/:id',authMiddleware,fetchIncDetailsCtrl)
incomeRoute.put('/:id',authMiddleware,updateIncCtrl)
incomeRoute.delete('/:id',authMiddleware,deleteIncCtrl)
incomeRoute.get('/total/:id',authMiddleware,getTotalIncome)
incomeRoute.get('/summary/:id',authMiddleware,getIncomeSummary)
module.exports=incomeRoute;