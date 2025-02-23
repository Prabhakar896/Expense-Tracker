import React, { useEffect, useState } from "react";
import axios from "axios";

const ExpSummary = ({ userId }) => {
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    minExpense: 0,
    maxExpense: 0,
    avgExpense: 0,
  });

  useEffect(() => {
    const fetchExpenseSummary = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/expenses/summary/${userId}`, {
          withCredentials: true,
        });
  
        console.log("API Response:", response.data.totalExpenses);
        console.log("User ID received:", userId); // Debugging
        // Debugging log
  
        if (response.data) {
          setSummary({
            totalExpenses: response.data.totalExpenses || 0,
            minExpense: response.data.minExpense || 0,
            maxExpense: response.data.maxExpense || 0,
            avgExpense: response.data.avgExpense || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching expense summary:", error);
      }
    };
  
    fetchExpenseSummary();
  }, [userId]);
  

  return (
    <div className="expense-summary">
      <h2>Expense Summary</h2>
      <div className="summary-box">
        <p><strong>Total Expenses:</strong> {summary.totalExpenses}</p>
        <p><strong>Minimum Expense:</strong> ₹{summary.minExpense}</p>
        <p><strong>Maximum Expense:</strong> ₹{summary.maxExpense}</p>
        <p><strong>Average Expense:</strong> ₹{summary.avgExpense ? summary.avgExpense.toFixed(2) : "0.00"}</p>
      </div>
    </div>
  );
};

export default ExpSummary;
