const mongoose=require('mongoose')
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const dbConnect = async() => {
    try{
        await mongoose.connect(MONGO_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true

        });
        console.log(`DB Connected Succesfully`);
    } catch(err){
    console.log(`Error ${err.message}`)
    
    }

};
module.exports=dbConnect;