import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import FirstHome from "./pages/FirstHome"
import Login from "./pages/Login"
import Register from "./pages/Register";
import Home from "./pages/Home"
import Profile from "./pages/Profile";
import IncomeList from "./pages/IncomeList";
import ExpenseList from "./pages/ExpenseList";
import { AuthProvider } from "./AuthContext";

function App(){
 return(
   <Router><Routes>
<Route path="/" element={<FirstHome/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>
<Route path="/home" element={<Home/>}/>
<Route path="/profile" element={<Profile/>}/>
<Route path="/income" element={<IncomeList/>}/>
<Route path="/expense" element={<ExpenseList/>}/>
</Routes>
</Router>
  
 )
}
export default App;