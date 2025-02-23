import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExpSummary from "../components/ExpSummary";
import IncSummary from "../components/IncSummary";
import ChartSummary from "../components/ChartSummary";
import FuzzyText from "../Design/FuzzyText";
function Home() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [expenseData, setExpenseData] = useState(null);
    const [incomeData, setIncomeData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("https://expense-tracker-crmj.onrender.com/api/users", {
                    withCredentials: true,
                });
                setUserId(response.data._id);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchExpenses = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`https://expense-tracker-crmj.onrender.com/api/tot/summary/exp/${userId}`, {
                        withCredentials: true,
                    });
                    setExpenseData(response.data);
                } catch (error) {
                    console.error("Error fetching expense data:", error);
                }
            }
        };

        const fetchIncome = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`https://expense-tracker-crmj.onrender.com/api/tot/summary/inc/${userId}`, {
                        withCredentials: true,
                    });
                    setIncomeData(response.data);
                } catch (error) {
                    console.error("Error fetching income data:", error);
                }
            }
        };

        fetchExpenses();
        fetchIncome();
    }, [userId]);

    const handleLogout = async () => {
        try {
            const response = await axios.post("https://expense-tracker-crmj.onrender.com/api/users/logout", {}, { withCredentials: true });
            alert(response.data.message);
            navigate("/");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };
    const handleSignOut = async () => {
        try {
           
            navigate("/login");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#151636] to-[#22245c] text-white font-sans">
          
            <div className="w-full p-6 bg-[#151636]/80 backdrop-blur-md border-b border-[#22245c]">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
  <FuzzyText 
    baseIntensity={0.1} 
    hoverIntensity={0.3} 
    enableHover={true} 
    className="text-2xl font-bold"
  >
    Finance Dashboard
  </FuzzyText>
</h1>

                    </h1>
                {userId ?( <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-gradient-to-r from-red-500 cursor-pointer to-pink-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
                    >
                        Logout
                    </button>):( <button
                        onClick={handleSignOut}
                        className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 cursor-pointer text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
                    >
                        Login
                    </button>)}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Welcome Message */}
                    <div className="bg-[#22245c]/50 p-6 rounded-xl backdrop-blur-md border border-[#22245c] shadow-lg mt-[25px]">
                        <h2 className="text-xl font-semibold">Welcome Back!</h2>
                        <p className="text-gray-300">Manage your finances with ease.</p>
                    </div>

                    {/* Expense and Income Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[70px]">
                        {userId && (
                            <div className="bg-[#22245c]/50 p-6 rounded-xl backdrop-blur-md border border-[#22245c] shadow-lg hover:scale-105 transition-transform duration-300">
                                <ExpSummary userId={userId} />
                            </div>
                        )}
                        {userId && (
                            <div className="bg-[#22245c]/50 p-6 rounded-xl backdrop-blur-md border border-[#22245c] shadow-lg hover:scale-105 transition-transform duration-300">
                                <IncSummary userId={userId} />
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                  {userId &&(<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-[70px]">
                        <button
                            onClick={() => navigate("/expense")}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 cursor-pointer p-4 rounded-xl text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-blue-500/50"
                        >
                            Expense List
                        </button>
                        <button
                            onClick={() => navigate("/income")}
                            className="bg-gradient-to-r from-green-500 to-teal-500 cursor-pointer p-4 rounded-xl text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-green-500/50"
                        >
                            Income List
                        </button>
                        <button
                            onClick={() => navigate("/profile")}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 cursor-pointer rounded-xl text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-purple-500/50"
                        >
                            Profile
                        </button>
                       
                    </div>)}
                </div>

                {/* Right Section for Chart */}
               {userId && ( <div className="bg-[#6164ad]/50 p-6 h-[500px] text-gray-100 rounded-xl backdrop-blur-md border border-[#22245c] shadow-lg hover:scale-105 transition-transform duration-300">
                    {expenseData && incomeData && (
                        <ChartSummary expenseData={expenseData.totalExpenses} incomeData={incomeData.totalIncome} />
                    )}
                </div>)}
            </div>
        </div>
    );
}

export default Home;