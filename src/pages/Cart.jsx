import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import baseURL from "../config.js";


const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart(); // ✅ اصلاح شد
    const getImageUrl = (img) => {
        if (!img) return `${baseURL}/images/no-image.png`;
        return img.startsWith(baseURL) ? img : `${img}`;
    };




    // ✅ جلوگیری از خطا وقتی cartItems خالی/نامعتبر باشد
    const totalPrice = (cartItems || []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="container mx-auto px-5 py-10" dir="rtl">
            <h1 className="text-2xl font-bold mb-6">سبد خرید</h1>

            {(cartItems || []).length === 0 ? (
                <div className="text-center bg-white p-10 shadow rounded">
                    <p className="text-gray-600 mb-4">سبد خرید شما خالی است</p>
                    <Link
                        to="/"
                        className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
                    >
                        بازگشت به فروشگاه
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {/* لیست محصولات */}
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-start bg-white shadow rounded p-4">

                                {/* ستون تصویر + ویژگی‌ها */}
                                <div className="flex flex-col items-center w-28">
                                    <img
                                        src={getImageUrl(item.images[0])}
                                        alt={item.name}
                                        className="w-24 h-24 object-contain"
                                    />


                                    <div className="flex flex-nowrap text-[10px] text-gray-500 mt-2 gap-1 mr-4">
                                        {item.attributes.map((a) => (
                                            <div
                                                key={a.id}
                                                className="px-1 py-0.5 bg-gray-300 rounded whitespace-nowrap"
                                            >
                                                {a.attribute?.name}: {a.value}
                                            </div>
                                        ))}
                                    </div>


                                </div>

                                {/* جزئیات محصول */}
                                <div className="flex-1 mr-4">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-red-600">{item.price} تومان</p>

                                    {/* دکمه تغییر تعداد */}
                                    <div className="flex items-center mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                        <span className="px-4">{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                item.quantity > 1 &&
                                                updateQuantity(item.id, item.quantity - 1)
                                            }
                                            className="px-3 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>

                                {/* حذف */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    حذف
                                </button>
                            </div>


                        ))}
                    </div>

                    {/* خلاصه سفارش */}
                    <div className="bg-white shadow rounded p-5">
                        <h2 className="text-lg font-bold border-b pb-2 mb-4">
                            خلاصه سفارش
                        </h2>
                        <p className="flex justify-between mb-2">
                            <span>جمع مبلغ:</span>
                            <span className="font-semibold text-red-600">
                {totalPrice.toLocaleString()} تومان
              </span>
                        </p>
                        <Link
                            to="/checkout"
                            className="block w-full text-center bg-green-600 text-white py-3 rounded mt-4 hover:bg-green-700"
                        >
                            ادامه ثبت سفارش
                        </Link>

                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
