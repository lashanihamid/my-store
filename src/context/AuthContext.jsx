// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import baseURL from "../config.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) || null;
    });
    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    // ✅ اگر توکن وجود داشت، اتومات به axios اضافه کن
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    // ✅ ذخیره یوزر
    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    // ✅ لاگین با موبایل
    const login = async (phone, password) => {
        try {
            const response = await axios.post(`${baseURL}/login`, { phone, password });
            if (response.data && response.data.token) {
                setToken(response.data.token);
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: "ورود ناموفق بود!" };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "خطای ارتباط با سرور!" };
        }
    };

    // ✅ مخصوص Checkout (وقتی خود سرور token داد)
    const setAuth = ({ token, user }) => {
        if (token) setToken(token);
        if (user) setUser(user);
    };

    // ✅ خروج کاربر
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
