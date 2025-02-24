import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Particles from "../Design/Particles"; 
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; 
import ax from "./axios";

function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await ax.post("/users/register", userData);
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setTimeout(() => {
          navigate("/home");
        }, 500);
      } else {
        setError(response.data.msg || "Registration failed!");
      }
    } catch (error) {
      console.error("Registration failed:", error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Particles particleColors={['#ffffff', '#ffffff']} particleCount={400} particleSpread={7} speed={0.5} particleBaseSize={100} moveParticlesOnHover={true} alphaParticles={false} disableRotation={false} />
      </div>
      
      <div className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-6">Register</h1>
        {error && <div className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-300 rounded-lg text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {[{ label: "First Name", name: "firstname", icon: FaUser },
              { label: "Last Name", name: "lastname", icon: FaUser },
              { label: "Email", name: "email", icon: FaEnvelope, type: "email" },
              { label: "Password", name: "password", icon: FaLock, type: "password" }].map(({ label, name, icon: Icon, type = "text" }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                <div className="relative">
                  <input type={type} name={name} placeholder={`Enter your ${label.toLowerCase()}`} value={userData[name]} onChange={handleInputChange} className="w-full px-4 py-3 pl-10 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                  <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-gray-900 font-semibold rounded-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Register</button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-300">Already have an account? <span onClick={() => navigate("/login")} className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">Login</span></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
