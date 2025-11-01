import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import CartPage from "./pages/Cart";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccess from "./pages/payment-success.jsx";
import PaymentFail from "./pages/payment-fail.jsx";
import Login from "./pages/auth/Login.jsx";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import ArticlesPage from "./pages/ArticlesPage.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";

const BASE_URL = "https://shirazchap.net/api/";



function App() {
    const location = useLocation(); // ✅ گرفتیم مسیر فعلی

    // ✅ مسیرهایی که نباید هدر و فوتر در آن‌ها نمایش داده شوند
    const hideLayoutRoutes = ["/login"];
    const hideLayout = hideLayoutRoutes.includes(location.pathname);
    const PrivateRoute = ({ children }) => {
        const { token } = useAuth();
        return token ? children : <Navigate to="/login" />;
    };

    return (
        <div className="min-h-screen w-full flex flex-col overflow-hidden"

        >
            <SiteSettingsProvider> {/* ✅ اضافه شد */}
                <AuthProvider>
            {/* ✅ اگر hideLayout false باشد، Header نمایش داده می‌شود */}

            <main className="flex-grow">

                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/category/:id" element={<CategoryProducts />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    {/*<Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />*/}
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-fail" element={<PaymentFail />} />
                        <Route path="/articles" element={<ArticlesPage />} />
                        <Route path="/article/:id" element={<ArticleDetail />} />
                </Routes>
            </main>

            {/* ✅ Footer هم مثل Header فقط وقتی نمایش داده می‌شه که hideLayout=false باشه */}
            {!hideLayout && <Footer />}
            </AuthProvider>
            </SiteSettingsProvider>

        </div>
    );
}

export default App;
