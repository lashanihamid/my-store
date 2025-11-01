import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSiteSettings } from "../context/SiteSettingsContext";
import baseURL from "../config.js";
import GlareHover from '../components/GlareHover'
import '../components/GlareHover.css';
import {
    FaHome,
    FaBoxOpen,
    FaInfoCircle,
    FaPhone,
    FaBookOpen,
    FaClipboardList,
} from "react-icons/fa";

const Header = () => {
    const [categories, setCategories] = useState([]);
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const { user, logout } = useAuth();
    const { settings, loading } = useSiteSettings();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    useEffect(() => {
        fetch(`${baseURL}/categories`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setCategories(data.data);
            })
            .catch((err) => console.error("خطا در دریافت دسته‌بندی‌ها:", err));
    }, []);

    return (
        <header
            className="shadow-md border-b"
            style={{ backgroundColor: settings.main_header_color }}
        >
            {/* Top Bar */}
            <div className="text-sm text-gray-600 px-4 py-2 flex justify-between items-center container mx-auto">
                <span>به فروشگاه ما خوش آمدید</span>
                <span>تماس: 09330000000</span>
            </div>

            {/* Main Header */}
            <div className="px-4 py-4 container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
  <GlareHover
    rotateAmplitude={10}
    glareColor="rgba(255,255,255,0.4)"
    scaleOnHover={1.05}
  >
    <img
      src={`${settings.site_url}/${settings.site_logo}`}
      alt="لوگو"
      className="h-12 object-contain"
    />
  </GlareHover>
</Link>

                {/* Search */}
                <div className="w-full px-4 py-2 md:flex-1 md:mx-6">
                    <input
                        type="text"
                        placeholder="جستجو محصولات..."
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                {/* User & Cart */}
                <div className="flex items-center gap-4 text-gray-600">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-gray-700">👋 {user.name}</span>
                            <button
                                onClick={logout}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                خروج
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            ورود
                        </Link>
                    )}
                    <Link to="/cart" className="hover:text-blue-600">
                        سبد خرید
                    </Link>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav
                style={{ backgroundColor: settings.main_menu_color || "#1f2937" }}
                className="text-gray-900 text-sm font-bold"
            >
                {/* Hamburger Menu Button - فقط در موبایل نمایش داده می‌شود */}
                <button
                    className="md:hidden text-gray-700 text-2xl"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </button>


                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white shadow-lg border-t z-50">
                        <ul className="flex flex-col p-4 gap-4 text-sm font-medium text-gray-800">
                            <li>
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                                    <FaHome />
                                    خانه
                                </Link>
                            </li>

                            <li>
                                <details className="group">
                                    <summary className="flex items-center gap-2 cursor-pointer">
                                        <FaBoxOpen />
                                        محصولات
                                    </summary>
                                    <ul className="pl-6 mt-2 space-y-2">
                                        {categories.map((cat) => (
                                            <li key={cat.id}>
                                                <Link
                                                    to={`/category/${cat.id}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="block hover:text-blue-600"
                                                >
                                                    {cat.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </li>

                            <li>
                                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                                    <FaInfoCircle />
                                    کانون شهر راز
                                </Link>
                            </li>

                            <li>
                                <Link to="/catalog/samples" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                                    <FaBookOpen />
                                    کاتالوگ
                                </Link>
                            </li>

                            <li>
                                <Link to="/about/rules" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                                    <FaClipboardList />
                                    درباره ما
                                </Link>
                            </li>

                            <li>
                                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                                    <FaPhone />
                                    ارتباط با ما
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
                <div className="container mx-auto px-4 hidden md:flex ">
                    <ul className="flex gap-6 items-center">
                        {/* خانه */}
                        <li>
                            <Link to="/" className="flex items-center gap-2">
                                <FaHome />
                                خانه
                            </Link>
                        </li>

                        {/* محصولات */}
                        <li
                            className="relative py-3 cursor-pointer"
                            onMouseEnter={() => setShowMegaMenu(true)}
                            onMouseLeave={() => setShowMegaMenu(false)}
                        >
              <span className="flex items-center gap-2">
                <FaBoxOpen />
                محصولات
              </span>

                            {showMegaMenu && (
                                <div className="absolute right-0 top-full bg-white text-black shadow-xl rounded-b-lg p-6 z-50 w-[800px]">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                to={`/category/${cat.id}`}
                                                className="block text-sm font-medium text-gray-700 hover:text-blue-600"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>

                        {/* کانون شهر راز */}
                        <li>
                            <Link to="/about" className="flex items-center gap-2">
                                <FaInfoCircle />
                                کانون شهر راز
                            </Link>
                        </li>

                        {/* کاتالوگ */}
                        <li className="relative group">
              <span className="flex items-center gap-2 cursor-pointer">
                <FaBookOpen />
                کاتالوگ
              </span>
                        </li>

                        {/* درباره ما */}
                        <li className="relative group">
              <span className="flex items-center gap-2 cursor-pointer">
                <FaClipboardList />
                درباره ما
              </span>
                        </li>

                        {/* ارتباط با ما */}
                        <li>
                            <Link to="/contact" className="flex items-center gap-2">
                                <FaPhone />
                                ارتباط با ما
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;