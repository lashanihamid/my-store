import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function PaymentSuccess() {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart(); // ✅ فقط یک بار اجرا می‌شود
    }, []); // ✅ خالی گذاشتن یعنی فقط در اولین رندر

    return (
        <div className="text-center p-10" dir="rtl">
            <h1 className="text-green-600 text-3xl font-bold mb-4">
                پرداخت با موفقیت انجام شد ✅
            </h1>
            <p className="text-gray-700 mb-6">
                سفارش شما با موفقیت ثبت شد و پرداخت انجام گردید.
            </p>
            <Link
                to="/"
                className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
            >
                بازگشت به صفحه اصلی
            </Link>
        </div>
    );
}
