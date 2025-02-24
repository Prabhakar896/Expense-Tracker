import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExpSummary from "../components/ExpSummary";
import IncSummary from "../components/IncSummary";
import ChartSummary from "../components/ChartSummary";
import FuzzyText from "../Design/FuzzyText";
import ax from "./axios";

function Home() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [expenseData, setExpenseData] = useState(null);
    const [incomeData, setIncomeData] = useState(null);
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await ax.get("/users");
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
                    const response = await ax.get(`/tot/summary/exp/${userId}`, {
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
                    const response = await ax.get(`/tot/summary/inc/${userId}`);
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
            const response = await ax.post("/users/logout", {});
            alert(response.data.message);
            navigate("/");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#151636] to-[#22245c] text-white font-sans px-4 sm:px-6 md:px-8">
            <div className="w-full p-4 md:p-6 bg-[#151636]/80 backdrop-blur-md border-b border-[#22245c] flex justify-between items-center">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    <FuzzyText baseIntensity={0.1} hoverIntensity={0.3} enableHover={true}>
                        Finance Dashboard
                    </FuzzyText>
                </h1>
                <button onClick={handleLogout} className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50 text-xs sm:text-sm md:text-base">
                    Logout
                </button>
            </div>

            <div className="max-w-7xl mx-auto py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#22245c]/50 p-4 sm:p-6 rounded-xl backdrop-blur-md border border-[#22245c] shadow-lg">
                        <h2 className="text-lg sm:text-xl font-semibold">Welcome Back!</h2>
                        <p className="text-gray-300 text-xs sm:text-sm">Manage your finances with ease.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ExpSummary userId={userId} />
                        <IncSummary userId={userId} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <button onClick={() => navigate("/expense")} className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 sm:p-4 rounded-xl text-white hover:scale-105 transition-transform duration-300 shadow-lg text-xs sm:text-sm md:text-base">
                            Expense List
                        </button>
                        <button onClick={() => navigate("/income")} className="bg-gradient-to-r from-green-500 to-teal-500 p-2 sm:p-4 rounded-xl text-white hover:scale-105 transition-transform duration-300 shadow-lg text-xs sm:text-sm md:text-base">
                            Income List
                        </button>
                        <button onClick={() => navigate("/profile")} className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-4 rounded-xl text-white hover:scale-105 transition-transform duration-300 shadow-lg text-xs sm:text-sm md:text-base">
                            Profile
                        </button>
                    </div>
                </div>
                <div className="bg-[#6164ad]/50 p-4 sm:p-6 h-[250px] sm:h-[400px] md:h-[500px] rounded-xl border border-[#22245c] shadow-lg">
                    {expenseData && incomeData && <ChartSummary expenseData={expenseData.totalExpenses} incomeData={incomeData.totalIncome} />}
                </div>
            </div>
        </div>
    );
}

export default Home;
