import axios from "axios";
import baseURL from "../../config.js";


export const login = async (email, password) => {
    try {
        const response = await axios.post(`${baseURL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};

export const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${baseURL}/register`, { name, email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Register failed";
    }
};

export const logout = async () => {
    await axios.post(`${baseURL}/logout`);
};
