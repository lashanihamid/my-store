import axios from "axios";

const api = axios.create({
    baseURL: "https://shirazchap.net/api/api", // اگر با https مشکل داشت http کن
    withCredentials: true,
});

export default api;
