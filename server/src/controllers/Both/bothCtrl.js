const expressAsyncHandler = require("express-async-handler");
const Expense = require("../../model/Expense");
const { default: mongoose } = require("mongoose");
const Income = require("../../model/Income");

const TotalProfit = expressAsyncHandler(async(req,res)=>{
    const userid=req.user._id
    const exp=await Expense.aggregate([
        {$match:{user:new mongoose.Types.ObjectId(userid)}},
        {$group:{_id:null,exptot:{$sum:{$toDouble:"$amount"}}}}
    ])
    const inc=await Income.aggregate([
        {$match:{user:new mongoose.Types.ObjectId(userid)}},
        {$group:{_id:null,exptot:{$sum:{$toDouble:"$amount"}}}}
    ])
    const totalProfit=inc[0].exptot-exp[0].exptot;
    res.json({tot:totalProfit})
})

module.exports=TotalProfit