import React, { useEffect, useState } from "react";
import axios from "axios";

const IncSummary = ({ userId }) => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    minIncome: 0,
    maxIncome: 0,
    avgIncome: 0,
  });

  useEffect(() => {
    const fetchIncomeSummary = async () => {
      try {
        const response = await axios.get(`https://expense-tracker-crmj.onrender.com/api/income/summary/${userId}`, {
          withCredentials: true,
        });
  
        console.log("API Response:", response.data.totalIncome);
        console.log("User ID received:", userId); // Debugging
        // Debugging log
  
        if (response.data) {
          setSummary({
            totalIncome: response.data.totalIncome || 0,
            minIncome: response.data.minIncome || 0,
            maxIncome: response.data.maxIncome|| 0,
            avgIncome: response.data.avgIncome|| 0,
          });
        }
      } catch (error) {
        console.error("Error fetching expense summary:", error);
      }
    };
  
    fetchIncomeSummary();
  }, [userId]);
  

  return (
    <div className="expense-summary">
      <h2>Income Summary</h2>
      <div className="summary-box">
        <p><strong>Total Expenses:</strong> {summary.totalIncome}</p>
        <p><strong>Minimum Expense:</strong> ₹{summary.minIncome}</p>
        <p><strong>Maximum Expense:</strong> ₹{summary.maxIncome}</p>
        <p><strong>Average Expense:</strong> ₹{summary.avgIncome ? summary.avgIncome.toFixed(2) : "0.00"}</p>
      </div>
    </div>
  );
};

export default IncSummary;
