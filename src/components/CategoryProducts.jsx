import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaInfoCircle, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import baseURL from "../config.js";
import baseURL_image from "../URL_image.js";
import { useSiteSettings } from "../context/SiteSettingsContext";

const DEFAULT_IMG = "/default-product.png"; // تصویر پیش‌فرض

const CategoryProducts = () => {
    const { settings, loading } = useSiteSettings();
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState("");
    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (!settings.featured_category_id) return;

        axios
            .get(`${baseURL}/categories/${settings.featured_category_id}/products`)
            .then((res) => {
                if (res.data.success && Array.isArray(res.data.products)) {
                    setProducts(res.data.products);
                    setTitle(res.data.category.name);
                }
            })
            .catch((err) => console.error("خطا در دریافت محصولات:", err));
    }, [settings.featured_category_id]);

    const handleAddToCart = (product) => {
        if (!product) return;
        setAdding(true);

        const item = {
            id: product.id,
            name: product.name,
            price: product.price_num,
            image: product.images?.[0] || DEFAULT_IMG,
            quantity: qty,
        };

        // فرض بر اینه که تابع addToCart از context یا props میاد
        // addToCart(item);

        setAdding(false);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-5 py-10 text-center text-gray-500">
                در حال بارگذاری محصولات...
            </div>
        );
    }

    return (
        <div className="max-w p-6">
        <div className="container mx-auto px-5 py-8 border md:rounded-xl" dir="rtl"
             style={{ backgroundColor: settings.category_bg }}
        >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-bold">{title}</h2>
                <Link to={`/category/${settings.featured_category_id}`} className="text-red-500 text-sm hover:underline">
                    مشاهده همه
                </Link>
            </div>

            <Swiper
                modules={[Navigation]}
                navigation
                loop
                spaceBetween={6}
                slidesPerView={1    }
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <div className="bg-white shadow-md rounded-lg p-4 text-right hover:shadow-xl transition-all duration-300">
                            <Link to={`/product/${product.id}`}>
                                <img
                                    src={baseURL_image + product.image}
                                    alt={product.name}
                                    className="w-full h-56 object-contain mb-4 rounded-lg"
                                />
                            </Link>

                            <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{product.name}</h3>

                            <div className="mb-4">
                                {product.discount_price ? (
                                    <>
                                        <span className="text-red-600 font-bold ml-2">{product.discount_price} تومان</span>
                                        <span className="line-through text-gray-400 text-sm">{product.price} تومان</span>
                                    </>
                                ) : (
                                    <span className="text-gray-800 font-bold">{product.price} تومان</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                >
                                    <FaShoppingCart /> افزودن به سبد
                                </button>

                                <Link
                                    to={`/product/${product.id}`}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                                >
                                    <FaInfoCircle /> جزئیات
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
        </div>
    );
};

export default CategoryProducts;