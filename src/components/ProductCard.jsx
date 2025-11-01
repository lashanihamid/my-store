import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import baseURL from "../config.js";
import baseURL_image from "../URL_image.js";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [adding, setAdding] = useState(false);
    const [qty, setQty] = useState(1);

    // ساخت مسیر تصویر محصول
    const productImage = product.image?.startsWith("http")
        ? product.image
        : baseURL_image + product.image;


    const handleAddToCart = () => {
        if (!product) return;
        setAdding(true);

        const item = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: productImage , // ✅ تصویر درست
            quantity: qty,
        };

        addToCart(item); // ✅ ارسال صحیح با تعداد و تصویر
        setAdding(false);
    };
    return (
        <div className="bg-white shadow-md md:rounded-lg p-4 text-right hover:shadow-xl transition-all duration-300">
            {/* تصویر محصول */}
            <Link to={`/product/${product.id}`}>
                <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-56 object-contain mb-4 rounded-lg"
                />
            </Link>

            {/* عنوان */}
            <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{product.name}</h3>

            {/* قیمت */}
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

            {/* دکمه‌ها */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handleAddToCart}
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
    );
};

export default ProductCard;
