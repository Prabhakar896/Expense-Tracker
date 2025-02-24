import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ax from "./axios";

function IncomeList() {
    const navigate = useNavigate();
    const [incomes, setIncomes] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editIncome, setEditIncome] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", amount: "" });
    const [isCreating, setIsCreating] = useState(false);

    const fetchIncomeDetails = async (page = 1) => {
        try {
            const response = await ax.get(`/income/spec?page=${page}`);
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
            await ax.delete(`/income/${id}`);
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
            const response = await ax.put(`/income/${editIncome._id}`, formData);
            setIncomes(incomes.map((income) => (income._id === editIncome._id ? response.data : income)));
            setEditIncome(null);
        } catch (error) {
            console.error("Error updating income:", error);
        }
    };

    const handleAddIncome = async () => {
        try {
            const response = await ax.post("/income/spec", formData);
            setIncomes([...incomes, response.data]);
            setFormData({ title: "", description: "", amount: "" });
            setIsCreating(false);
        } catch (error) {
            console.error("Error adding income:", error);
        }
    };

    const filteredIncomes = incomes?.filter(income => income?.title?.toLowerCase()?.includes(search.toLowerCase())) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#151636] to-[#22245c] text-white p-4 sm:p-8 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Income List
                </h1>
                <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-0">
                    <button onClick={() => setIsCreating(true)} className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:scale-105 transition duration-300">
                        Create Income
                    </button>
                    <button onClick={() => navigate('/home')} className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:scale-105 transition duration-300">
                        Home
                    </button>
                </div>
            </div>

            <input type="text" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 bg-[#151636] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />

            {isCreating && (
                <div className="bg-[#22245c]/50 p-6 rounded-xl mb-8 border border-[#22245c]">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Create Income</h2>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 bg-[#151636] rounded-lg mb-2" />
                    <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 bg-[#151636] rounded-lg mb-2" />
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" className="w-full p-2 bg-[#151636] rounded-lg mb-2" />
                    <div className="flex gap-4">
                        <button onClick={handleAddIncome} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add</button>
                        <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Cancel</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border border-[#22245c]">
                    <thead className="bg-[#151636]">
                        <tr>
                            <th className="p-2 sm:p-4">Title</th>
                            <th className="p-2 sm:p-4">Description</th>
                            <th className="p-2 sm:p-4">Amount</th>
                            <th className="p-2 sm:p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncomes.length > 0 ? (
                            filteredIncomes.map((income, index) => (
                                <tr key={income._id} className={`${index % 2 === 0 ? "bg-[#22245c]" : "bg-[#151636]"}`}>
                                    <td className="p-2 sm:p-4">{income.title}</td>
                                    <td className="p-2 sm:p-4">{income.description}</td>
                                    <td className="p-2 sm:p-4">{income.amount}</td>
                                    <td className="p-2 sm:p-4">
                                        <button onClick={() => handleEdit(income)} className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-lg">Edit</button>
                                        <button onClick={() => handleDelete(income._id)} className="ml-2 px-2 sm:px-4 py-1 sm:py-2 bg-red-500 text-white rounded-lg">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="p-4 text-center">No incomes found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default IncomeList;
