import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import baseURL from "../config.js";
const CategoryProducts = () => {
    const { id } = useParams();
    const [categoryName, setCategoryName] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${baseURL}/categories/${id}/products`)
            .then((res) => res.json())
            .then((data) => {
                setCategoryName(data.category?.name || "دسته بندی");
                setProducts(data.products || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="text-center py-10">در حال بارگذاری...</p>;

    return (
        <div className="container mx-auto px-5 py-10 text-right">
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-500 pb-2">
                {categoryName}
            </h2>

            {products.length === 0 ? (
                <p className="text-center text-gray-600">هیچ محصولی یافت نشد.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="border rounded-lg shadow hover:shadow-lg transition bg-white"
                        >
                            <img
                                src={
                                    product.image
                                        ? `https://shirazchap.net/api/${product.image}`
                                        : "https://via.placeholder.com/200"
                                }
                                alt={product.name}
                                className="w-full h-44 object-contain p-3"
                            />

                            <div className="p-3 space-y-2">
                                <h3 className="font-bold text-sm h-10 overflow-hidden">
                                    {product.name}
                                </h3>

                                <div className="text-left space-y-1">
                                    {product.discount_price ? (
                                        <>
                                            <p className="text-sm line-through text-gray-400">
                                                {product.price} تومان
                                            </p>
                                            <p className="text-red-600 font-bold">
                                                {product.discount_price} تومان
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-gray-800 font-bold">
                                            {product.price} تومان
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-3">
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        جزئیات
                                    </Link>
                                    <button className="p-2 border rounded hover:bg-gray-100">
                                        <FaShoppingCart className="text-red-600" size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;
