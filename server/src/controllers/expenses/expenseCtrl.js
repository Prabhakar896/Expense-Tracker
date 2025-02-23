const { populate } = require("dotenv");
const Expense = require("../../model/Expense");
const expressAsyncHandler=require('express-async-handler');
const User = require("../../model/User");
const { default: mongoose } = require("mongoose");
const createExpCtrl = expressAsyncHandler(async(req,res)=>{

 const {title,amount,description,user}=req.body  
 const userId=req.user?.id;
 if (!userId) {
  return res.status(400).json({ message: "User ID is required" });
}
  try{
const expense=await Expense.create({title,amount,
    description:description,user:userId
})
res.json(expense)
}catch(err)
{
res.json(err)
}
})

const fetchAllExpCtrl = expressAsyncHandler(async(req,res)=>{
  const {page} = req.query
  const userId = req.user.id; 

     try{
   const expense=await Expense.paginate({user: userId},{limit:15,page:Number(page),populate:'user'})
   if (expense.docs.length === 0) {
    return res.json([]); 
}
res.json({
  expense: expense.docs,
  totalPages: expense.totalPages,
  currentPage: expense.page,
});
   }catch(err)
   {
    res.status(500).json({ message: "Error fetching incomes", error: err.message });
  }
   })
   const fetchExpDetailsCtrl = expressAsyncHandler(async(req,res)=>{
    const {id}=req?.params
        try{
      const expense=await Expense.findById(id)
      res.json(expense)
      }catch(err)
      {
      res.json(err)
      }
      })


  const updateExpCtrl = expressAsyncHandler(async(req,res)=>{
    const {id}=req?.params
    const {title,amount,description}=req.body
    try{
        const expense=await Expense.findByIdAndUpdate(id,{
            title,description,amount
        },{new:true})
        res.json(expense)
    }catch(err){
        res.json(err)
    }
  })
  const deleteExpCtrl = expressAsyncHandler(async(req,res)=>{
    const {id}=req?.params
        try{
      const expense=await Expense.findByIdAndDelete(id)
      res.json(expense)
      }catch(err)
      {
      res.json(err)
      }
      })
      const getTotalExpense = expressAsyncHandler(async (req, res) => {
        const userId = req.params.id;
      
        try {
          // Ensure userId is a valid ObjectId
          if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
          }
      
          // Await the aggregation result
          const totalExpense = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, totalexp: { $sum: { $toDouble: "$amount" } } } }
          ]);
      
          res.json({
            success: true,
            totalExpense: totalExpense.length > 0 ? totalExpense[0].totalexp : 0
          });
      
        } catch (err) {
          res.status(500).json({
            success: false,
            message: "Error fetching total expense",
            error: err.message
          });
        }
      });
      

      const getExpenseSummary = expressAsyncHandler(async (req, res) => {
        const userId = req.params.id; // Get userId from authenticated user
      
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
      
      

module.exports = { getExpenseSummary };

module.exports={createExpCtrl,fetchAllExpCtrl,fetchExpDetailsCtrl,updateExpCtrl,deleteExpCtrl,getTotalExpense,getExpenseSummary}