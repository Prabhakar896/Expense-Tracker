const { populate } = require("dotenv");
const Income = require("../../model/Income");
const expressAsyncHandler=require('express-async-handler')
const mongoose=require('mongoose')
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



const fetchAllIncCtrl = expressAsyncHandler(async (req, res) => {
    const { page=1 } = req.query;
    const userId = req.user.id; 

    try {
        const income = await Income.paginate(
            { user: userId }, 
            { limit: 15, page: Number(page), populate: "user" }
        );

        if (income.docs.length === 0) {
            return res.json([]); 
        }

        res.json({
          incomes: income.docs,
          totalPages: income.totalPages,
          currentPage: income.page,
      });
    } catch (err) {
        res.status(500).json({ message: "Error fetching incomes", error: err.message });
    }
});

   const fetchIncDetailsCtrl = expressAsyncHandler(async(req,res)=>{
    const {id}=req?.params
        try{
      const income=await Income.findById(id)
      res.json(income)
      }catch(err)
      {
      res.json(err)
      }
      })


  const updateIncCtrl = expressAsyncHandler(async(req,res)=>{
    const {id}=req?.params
    const {title,amount,description}=req.body
    try{
        const income=await Income.findByIdAndUpdate(id,{
            title,description,amount
        },{new:true})
        res.json(income)
    }catch(err){
        res.json(err)
    }
  })
  const deleteIncCtrl = expressAsyncHandler(async(req,res)=>{
    const {id}=req?.params
        try{
      const income=await Income.findByIdAndDelete(id)
      res.json(income)
      }catch(err)
      {
      res.json(err)
      }
      })

 const getTotalIncome = async (req, res) => {
     try {
       const userId = req.params.id;
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
    };
    const getIncomeSummary = expressAsyncHandler(async (req, res) => {
        const userId = req.params.id; // Get userId from authenticated user
      
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Invalid user ID" });
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
          res.status(500).json({ message: "Error fetching expense summary", error: err.message });
        }
      });
      
    
module.exports={createIncCtrl,fetchAllIncCtrl,fetchIncDetailsCtrl,updateIncCtrl,deleteIncCtrl,getTotalIncome,getIncomeSummary}