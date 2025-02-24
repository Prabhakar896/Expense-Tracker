const express=require('express')
const dbConnect=require("./config/dbConnect")
const cors = require("cors");
const app=express()

const userRoute = require('./routes/users/usersRoute')
const {registerUser}=require('./controllers/users/usersCtrl')
const { errorHandler ,notFound} = require('./middlewares/errorMiddleware')
const incomeRoute = require('./routes/income/IncomeRoute')
const expenseRoute = require('./routes/expenses/ExpenseRoute')
const BothRouter = require('./routes/Both/BothRoute')
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const path = require("path");


errorHandler
dbConnect();

app.use(cookieParser());

app.use(
    cors({
        origin: "https://expense-tracker-frontt.netlify.app",  // Frontend URL
        credentials: true,
        methods: "GET,POST,PUT,DELETE",
    })
);
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Origin", "https://expense-tracker-frontt.netlify.app");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  next();
});
app.use(express.json())
app.get("/api",(req,res)=>{
    res.json({msg:"Welcome Expenses tracker API"})
})
app.use('/api/users',userRoute)
app.use('/api/income',incomeRoute)
app.use('/api/expenses',expenseRoute)
app.use('/api/tot',BothRouter)
app.use(notFound)
app.use(errorHandler)

module.exports=app