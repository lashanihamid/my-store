import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    // ✅ اگر لاگین بود اجازه دیدن صفحه نده
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const result = await login(email, password);
        console.log(result)
        if (result.success) {
            navigate("/");
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">ورود به حساب کاربری</h2>
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-right">ایمیل</label>
                        <input
                            type="numer"
                            className="w-full border px-3 py-2 rounded"
                            placeholder="ایمیل خود را وارد کنید"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-right">رمز عبور</label>
                        <input
                            type="password"
                            className="w-full border px-3 py-2 rounded"
                            placeholder="رمز عبور خود را وارد کنید"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        ورود
                    </button>
                </form>
            </div>
        </div>
    );
}
