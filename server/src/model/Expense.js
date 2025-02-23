const mongoose=require('mongoose')
const mongoosePaginate=require("mongoose-paginate-v2")

const expenseSchema=mongoose.Schema({
    title:{
        type:String,
        required:[true,'title is required']
    },
    description:{
        type:String,
        required:[true,'description is required']
    },
    type:{
        type:String,
        default:"expense"
    }
    ,  amount:{
        type:Number,
        required:[true,'Amount is required']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"User Id is required"]
 }
},{
    timestamps:true,
    toJSON:{
        virtual:true,
    },
    toObject:{
        virtual:true,
    },
})
expenseSchema.plugin(mongoosePaginate)
const Expense=mongoose.model("Expense",expenseSchema);
module.exports=Expense