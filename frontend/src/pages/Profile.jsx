import { useState, useEffect } from "react";
import axios from "axios";
import FuzzyText from "../Design/FuzzyText"; 
import { useNavigate } from "react-router-dom";
import ax from "./axios";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await ax.get("/users/");
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
        fetchUserProfile();
    }, []);

    if (!user) {
        return <p className="text-white text-center mt-10">Loading user details...</p>;
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "my_preset");

        try {
            const cloudinaryResponse = await axios.post(
                "https://api.cloudinary.com/v1_1/dyt9trjvx/image/upload",
                formData
            );

            if (cloudinaryResponse.status === 200) {
                const imageUrl = cloudinaryResponse.data.secure_url;
                const updateResponse = await ax.put("/users/upload-profile-pic", { profilePic: imageUrl });

                if (updateResponse.status === 200) {
                    setUser({ ...user, profilePic: updateResponse.data.profilePic });
                    setMessage("Profile picture updated successfully!");
                } else {
                    setMessage("Failed to update profile picture.");
                }
            } else {
                setMessage("Cloudinary upload failed.");
            }
        } catch (err) {
            console.error("Error uploading profile picture:", err.response?.data || err);
            setMessage("Failed to upload profile picture.");
        }
    };

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
        <div className="min-h-screen bg-[#151636] text-white flex flex-col items-center px-4 sm:px-8">
            {/* Navbar */}
            <div className="w-full p-4 sm:p-6 bg-[#151636]/80 backdrop-blur-md border-b border-[#22245c] flex justify-between items-center max-w-7xl">
                <h1 className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    <FuzzyText baseIntensity={0.1} hoverIntensity={0.3} enableHover={true}>
                        Finance Dashboard
                    </FuzzyText>
                </h1>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/home')} className="px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50">
                        Home
                    </button>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50">
                        Logout
                    </button>
                </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center justify-center w-full max-w-xl mt-10">
                <div className="bg-[#22245c] p-6 sm:p-8 rounded-2xl shadow-xl w-full">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Profile</h2>
                    <div className="flex flex-col items-center">
                        <img src={user.profilePic || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
                            alt="Profile" 
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md" 
                        />
                        <p className="mt-4 text-lg font-semibold">{user.firstname} {user.lastname}</p>
                        <p className="text-sm text-gray-300">{user.email}</p>
                        <p className="text-sm text-gray-400 mt-2">Joined on {new Date(user.createdAt).toLocaleDateString()}</p>
                        
                        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-4 text-sm file:bg-white file:text-[#22245c] file:px-4 file:py-2 file:rounded-lg file:cursor-pointer" />
                        {preview && (
                            <img src={preview} alt="Preview" className="w-20 h-20 sm:w-28 sm:h-28 rounded-full mt-4 border-2 border-gray-300" />
                        )}
                        <button onClick={handleUpload} className="mt-4 px-4 sm:px-6 py-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold rounded-lg shadow-md transition duration-300">
                            Upload Profile Picture
                        </button>
                        {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
