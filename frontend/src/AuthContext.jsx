// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const checkAuth = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/users", {
                withCredentials: true,
            });
            setUser(response.data);
        } catch (error) {
            setUser(null);
            navigate("/signup"); // Redirect to sign-up page if not authenticated
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await axios.post("http://localhost:4000/api/users/logout", {}, { withCredentials: true });
            setUser(null);
            navigate("/signup"); // Redirect to sign-up page after logout
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);