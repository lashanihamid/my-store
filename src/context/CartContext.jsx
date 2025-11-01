import React, { createContext, useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // ✅ اضافه شد: رسیدگی به تصاویر

    const addToCart = (product) => {
        const exists = cartItems.find((item) => item.id === product.id);

        if (exists) {
            setCartItems(
                cartItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                )
            );
            toast.success("محصول به تعداد سبد اضافه شد");
        } else {
            setCartItems([
                ...cartItems,
                {
                    id: product.id, // ✅ مهم
                    product_id: product.product_id,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    images: product.images || [product.image] || [],
                    variant_id: product.variant_id || null,   // ✅ اضافه شد
                    attributes: product.attributes || null,   // ✅ اضافه شد
                },
            ]);
            toast.success("محصول به سبد اضافه شد");
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
        toast.error('محصول از سبد خرید حذف شد')

    };

    const updateQuantity = (id, amount) => {
        setCartItems(
            cartItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                    : item
            )
        );
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
        >
            {children}
            <ToastContainer />

        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
