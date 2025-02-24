import axios from "axios";
export default axios.create({
    baseURL:'https://expense-tracker-crmj.onrender.com/api',
   withCredentials:true, 
})