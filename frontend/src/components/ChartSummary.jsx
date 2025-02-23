// src/components/ChartSummary.js
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const ChartSummary = ({ expenseData, incomeData }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        if (expenseData !== null && incomeData !== null) {
            const totalExpenses = expenseData || 0;
            const totalIncome = incomeData || 0;
            const profit = totalIncome - totalExpenses;

            if (totalExpenses === 0 && totalIncome === 0) {
                setChartData({ labels: [], datasets: [] });
            } else {
                setChartData({
                    labels: ["Expense", "Profit"],
                    datasets: [
                        {
                            data: [totalExpenses, profit],
                            backgroundColor: ["#FF6384", "#36A2EB"],
                            borderColor: ["#FFFFFF", "#FFFFFF"],
                            borderWidth: 2,
                            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                            hoverOffset: 10,
                        },
                    ],
                });
            }
        }
    }, [expenseData, incomeData]);

    // Function to format numbers with Indian Rupees symbol
    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString("en-IN")}`;
    };

    return (
        <div
            style={{
                position: "relative",
                width: "350px",
                height: "450px",
                textAlign: "center",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFFFFF",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h2
                style={{
                    marginBottom: "10px",
                    fontSize: "24px",
                    color: "#333333",
                    fontWeight: "600",
                }}
            >
                Expense vs Profit
            </h2>
            {chartData.datasets.length > 0 ? (
                <>
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "250px", // Fixed height for the chart container
                        }}
                    >
                        <Pie
                            data={chartData}
                            options={{
                                maintainAspectRatio: false, // Disable aspect ratio to fit the container
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "bottom",
                                        labels: {
                                            font: {
                                                size: 14,
                                                family: "Arial, sans-serif",
                                            },
                                            color: "#333333", // Legend text color
                                        },
                                    },
                                    tooltip: {
                                        backgroundColor: "#FFFFFF",
                                        titleColor: "#333333",
                                        bodyColor: "#333333",
                                        borderColor: "#DDDDDD",
                                        borderWidth: 1,
                                        padding: 10,
                                        callbacks: {
                                            label: (context) => {
                                                const label = context.label || "";
                                                const value = context.raw || 0;
                                                return `${label}: ${formatCurrency(value)}`;
                                            },
                                        },
                                    },
                                },
                                animation: {
                                    duration: 1000,
                                    easing: "easeInOutQuart",
                                },
                            }}
                        />
                    </div>
                    <div
                        style={{
                            marginTop: "10px",
                            fontSize: "16px",
                            color: "#555555",
                        }}
                    >
                        <p style={{ margin: "10px 0" }}>
                            <strong>Total Income:</strong> {formatCurrency(incomeData)}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Total Expenses:</strong> {formatCurrency(expenseData)}
                        </p>
                        <p style={{ margin: "10px 0" }}>
                            <strong>Profit:</strong> {formatCurrency(incomeData - expenseData)}
                        </p>
                    </div>
                </>
            ) : (
                <p
                    style={{
                        color: "#FF6347",
                        fontSize: "18px",
                        fontWeight: "bold",
                        marginTop: "50px",
                    }}
                >
                    📊 Not enough data to generate the pie chart.
                </p>
            )}
        </div>
    );
};

export default ChartSummary;