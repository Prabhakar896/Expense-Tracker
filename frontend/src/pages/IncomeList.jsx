import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function IncomeList() {
    const navigate=useNavigate();
    const [incomes, setIncomes] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
    const [editIncome, setEditIncome] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", amount: "" });
    const [isCreating, setIsCreating] = useState(false);

    const fetchIncomeDetails = async (page = 1) => {
        try {
            const response = await axios.get(`https://expense-tracker-crmj.onrender.com/api/income/spec?page=${page}`, {
                withCredentials: true,
            });
    
            setIncomes(response.data.incomes);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error("Error fetching incomes:", error);
        }
    };
    
    useEffect(() => {
        
        fetchIncomeDetails(currentPage);
        
    }, [currentPage]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://expense-tracker-crmj.onrender.com/api/income/${id}`, {
                withCredentials: true,
            });
            setIncomes(incomes.filter((income) => income._id !== id));
        } catch (error) {
            console.error("Error deleting income:", error);
        }
    };

    const handleEdit = (income) => {
        setEditIncome(income);
        setFormData({ title: income.title, description: income.description, amount: income.amount });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        if (!editIncome) return;
        try {
            const response = await axios.put(`https://expense-tracker-crmj.onrender.com/api/income/${editIncome._id}`, formData, {
                withCredentials: true,
            });
            setIncomes(incomes.map((income) => (income._id === editIncome._id ? response.data : income)));
            setEditIncome(null);
        } catch (error) {
            console.error("Error updating income:", error);
        }
    };

    const handleAddIncome = async () => {
        try {
            const response = await axios.post("https://expense-tracker-crmj.onrender.com/api/income/spec", formData, {
                withCredentials: true,
            });
            setIncomes([...incomes, response.data]);
            setFormData({ title: "", description: "", amount: "" });
            setIsCreating(false);
        } catch (error) {
            console.error("Error adding income:", error);
        }
    };

    const filteredIncomes = incomes 
    ? incomes.filter(income => income?.title?.toLowerCase()?.includes(search.toLowerCase()))
    : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#151636] to-[#22245c] text-white p-8 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Income List
                </h1>
               
                <div className="flex gap-4">
        <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 cursor-pointer text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-green-500/50"
        >
            Create Income
        </button>

        <button 
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 cursor-pointer text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
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
            
            {/* Create Income Form */}
            {isCreating && (
                <div className="bg-[#22245c]/50 backdrop-blur-md p-6 rounded-xl mb-8 border border-[#22245c] shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Create Income</h2>
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
                                onClick={handleAddIncome}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 cursor-pointer to-purple-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-blue-500/50"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 cursor-pointer to-pink-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editIncome && (
                <div className="bg-[#22245c]/50 backdrop-blur-md p-6 rounded-xl mt-8 border border-[#22245c] shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Edit Income</h2>
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
                                onClick={() => setEditIncome(null)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 cursor-pointer text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Search Bar */}
            

            {/* Income Table */}
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
                            filteredIncomes.map((income, index) => (
                                <tr
                                    key={income._id}
                                    className={`${index % 2 === 0 ? "bg-[#22245c]" : "bg-[#151636]"}`}
                                >
                                    <td className="p-4">{income.title}</td>
                                    <td className="p-4">{income.description}</td>
                                    <td className="p-4">{income.amount}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(income)}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-500 cursor-pointer to-purple-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-blue-500/50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(income._id)}
                                                className="px-4 py-2 bg-gradient-to-r from-red-500 cursor-pointer to-pink-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
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
                                    No incomes found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
{/* Pagination Controls */}



            {/* Edit Income Form */}
           
            <div className="flex justify-center mt-4">
    <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg cursor-pointer disabled:opacity-50"
    >
        Previous
    </button>
    <span className="px-4 py-2 bg-gray-700 text-white rounded-lg">
        Page {currentPage} of {totalPages}
    </span>
    <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg cursor-pointer disabled:opacity-50"
    >
        Next
    </button>
</div>
        </div>
    );
}

export default IncomeList;