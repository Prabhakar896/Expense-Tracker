import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ExpenseList() {
    const navigate=useNavigate();
    const [expense, setExpense] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editexpense, setEditexpense] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", amount: "" });
    const [isCreating, setIsCreating] = useState(false);

    const fetchIncomeDetails = async () => {
        try {
            const response = await axios.get(`https://expense-tracker-crmj.onrender.com/api/expenses/spec?page=${currentPage}`, {
                withCredentials: true,
            });
            setExpense(response.data.expense);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error("Error fetching expense:", error);
        }
    };

    useEffect(() => {
        fetchIncomeDetails();
    }, [currentPage]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://expense-tracker-crmj.onrender.com/api/expenses/${id}`, {
                withCredentials: true,
            });
            setExpense(expense.filter((expense) => expense._id !== id));
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    const handleEdit = (expense) => {
        setEditexpense(expense);
        setFormData({ title: expense.title, description: expense.description, amount: expense.amount });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        if (!editexpense) return;
        try {
            const response = await axios.put(`https://expense-tracker-crmj.onrender.com/api/expenses/${editexpense._id}`, formData, {
                withCredentials: true,
            });
            setExpense(expense.map((expense) => (expense._id === editexpense._id ? response.data : expense)));
            setEditexpense(null);
        } catch (error) {
            console.error("Error updating expense:", error);
        }
    };

    const handleAddExpense = async () => {
        try {
            const response = await axios.post("https://expense-tracker-crmj.onrender.com/api/expenses/spec", formData, {
                withCredentials: true,
            });
            setExpense([...expense, response.data]);
            setFormData({ title: "", description: "", amount: "" });
            setIsCreating(false);
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };

    const filteredIncomes = expense
    ? expense.filter(expense => expense?.title?.toLowerCase()?.includes(search.toLowerCase()))
    : [];


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#151636] to-[#22245c] text-white p-8 font-sans">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Expense List
                </h1>
                <div className="flex gap-4">
        <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-green-500/50 "
        >
            Create Expense
        </button>

        <button 
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
        >
            Home
        </button>
    </div>
            </div>
            <input
                type="text"
                placeholder="Search by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 bg-[#151636] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
            />
            {/* Create Expense Form */}
            {isCreating && (
                <div className="bg-[#22245c]/50 backdrop-blur-md p-6 rounded-xl mb-8 border border-[#22245c] shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Create Expense</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Title"
                            className="w-full p-2 bg-[#151636] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full p-2 bg-[#151636] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Amount"
                            className="w-full p-2 bg-[#151636] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddExpense}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-blue-500/50"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            
{editexpense && (
                <div className="bg-[#22245c]/50 backdrop-blur-md p-6 rounded-xl mt-8 border border-[#22245c] shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Title"
                            className="w-full p-2 bg-[#151636] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full p-2 bg-[#151636] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Amount"
                            className="w-full p-2 bg-[#151636] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 cursor-pointer to-purple-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-blue-500/50"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setEditexpense(null)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 cursor-pointer to-pink-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Expense Table */}
            <div className="bg-[#22245c]/50 backdrop-blur-md rounded-xl border border-[#22245c] shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#151636]">
                        <tr>
                            <th className="p-4 text-left">Title</th>
                            <th className="p-4 text-left">Description</th>
                            <th className="p-4 text-left">Amount</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncomes.length > 0 ? (
                            filteredIncomes.map((expense, index) => (
                                <tr
                                    key={expense._id}
                                    className={`${index % 2 === 0 ? "bg-[#22245c]" : "bg-[#151636]"}`}
                                >
                                    <td className="p-4">{expense.title}</td>
                                    <td className="p-4">{expense.description}</td>
                                    <td className="p-4">{expense.amount}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(expense)}
                                                className="px-4 py-2 bg-gradient-to-r cursor-pointer from-blue-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-blue-500/50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(expense._id)}
                                                className="px-4 py-2 bg-gradient-to-r cursor-pointer from-red-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center">
                                    No expense found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
{/* Pagination Controls */}
<div className="flex justify-center mt-4">
    <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
    >
        Previous
    </button>
    <span className="px-4 py-2 bg-gray-700 text-white rounded-lg">
        Page {currentPage} of {totalPages}
    </span>
    <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
    >
        Next
    </button>
</div>

            {/* Edit Expense Form */}
            
        </div>
    );
}

export default ExpenseList;