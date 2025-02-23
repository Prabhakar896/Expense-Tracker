const mongoose=require('mongoose')
const mongoosePaginate=require("mongoose-paginate-v2")
const incomeSchema=mongoose.Schema({
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
        default:"income"
    }
    ,  amount:{
        type:String,
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
}
)
incomeSchema.plugin(mongoosePaginate);
const Income=mongoose.model("Income",incomeSchema);
module.exports=Income