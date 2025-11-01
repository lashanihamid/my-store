import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import baseURL from "../config.js";

const SHIPPING_COST = 50000; // تومان ثابت

export default function Checkout() {
    const { cartItems, clearCart } = useCart();
    const { user, token, setAuth } = useAuth ? useAuth() : { user: null, token: null, setAuth: null };
    const navigate = useNavigate();

    // آدرس‌ها (برای کاربر لاگین شده)
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    // حالت نمایش فرم اضافه/ویرایش آدرس
    const [showAddressForm, setShowAddressForm] = useState(false);

    // فرم آدرس (هم برای اضافه کردن هم برای ارسال در حالت مهمان)
    const [form, setForm] = useState({
        name: "",
        family: "",
        phone: "",
        province: "فارس",
        city: "شیراز",
        address: "",
        postal_code: "",
        note: "",
    });

    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // محاسبات
    const subtotal = (cartItems || []).reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 1)), 0);
    const shippingCost = SHIPPING_COST;
    const total = subtotal + shippingCost;

    // helper: resolve image (در صورت نیاز)
    const resolveImage = (img) => {
        if (!img) return "https://shirazchap.net/images/no-image.png";
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        return img.startsWith("/") ? `https://shirazchap.net${img}` : `https://shirazchap.net/${img}`;
    };

    // بارگذاری آدرس‌ها اگر کاربر لاگین باشد
    useEffect(() => {
        let mounted = true;
        const fetchAddresses = async () => {
            if (!user || !token) return;
            setLoadingAddresses(true);
            try {
                const res = await axios.get(`${baseURL}/addresses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!mounted) return;
                if (res.data && res.data.success) {
                    setAddresses(res.data.addresses || []);
                    // انتخاب آدرس پیش‌فرض اگر وجود داشته باشه
                    const def = (res.data.addresses || []).find(a => a.is_default) || (res.data.addresses || [])[0];
                    if (def) setSelectedAddressId(def.id);
                } else {
                    setAddresses([]);
                }
            } catch (e) {
                console.warn("Fetch addresses error:", e?.response?.data || e.message);
                setAddresses([]);
            } finally {
                if (mounted) setLoadingAddresses(false);
            }
        };

        fetchAddresses();
        return () => { mounted = false; };
    }, [user, token]);

    // بارگذاری فرم در صورت انتخاب آدرس برای نمایش (نمایش اطلاعات)
    useEffect(() => {
        if (!selectedAddressId) return;
        const a = addresses.find(ad => ad.id === selectedAddressId);
        if (a) {
            setForm({
                name: a.name || "",
                family: a.family, // ممکن است در بک‌اند جدا نباشد
                phone: a.phone || "",
                province: a.province || "فارس",
                city: a.city || "",
                address: a.address || "",
                postal_code: a.postal_code || "",
                note: ""
            });
        }
    }, [selectedAddressId, addresses]);

    // اعتبارسنجی فرم آدرس (name, family required as per request; family required)
    const validateAddress = () => {
        if (!form.name || !form.name.trim()) {
            setError("نام را وارد کنید.");
            return false;
        }
        if (!form.family || !form.family.trim()) {
            setError("نام خانوادگی را وارد کنید.");
            return false;
        }
        if (!form.phone || !form.phone.trim()) {
            setError("شماره موبایل را وارد کنید.");
            return false;
        }
        if (!form.address || !form.address.trim()) {
            setError("آدرس دقیق را وارد کنید.");
            return false;
        }
        setError(null);
        return true;
    };

    // ذخیره آدرس جدید برای کاربر لاگین شده
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!validateAddress()) return;
        if (!token) {
            setError("برای ذخیره آدرس ابتدا وارد شوید.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${baseURL}/addresses`, {
                name: form.name,
                family:form.family,
                phone: form.phone,
                province: form.province,
                city: form.city,
                address: form.address,
                postal_code: form.postal_code
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.success) {
                // بروزرسانی لیست آدرس‌ها
                setAddresses(prev => [res.data.address, ...prev]);
                setSelectedAddressId(res.data.address.id);
                setShowAddressForm(false);
                setError(null);
            } else {
                setError(res.data.message || "خطا در ذخیره آدرس");
            }
        } catch (err) {
            console.error("Save address error:", err);
            setError(err?.response?.data?.message || "خطا در ذخیره آدرس");
        } finally {
            setLoading(false);
        }
    };

    // ارسال سفارش
    const handlePayment = async () => {
        setError(null);

        // ابتدا بررسی سبد
        if (!cartItems || cartItems.length === 0) {
            setError("سبد خرید شما خالی است.");
            return;
        }

        // در صورت لاگین: باید آدرسی انتخاب شده باشد یا فرم جدید ذخیره شده باشه
        let shippingAddressPayload = null;
        if (user && token) {
            if (!selectedAddressId) {
                setError("لطفاً آدرس پیش‌فرض خود را انتخاب کنید یا آدرس جدید اضافه کنید.");
                return;
            }
            const selected = addresses.find(a => a.id === selectedAddressId);
console.log(selected)
            if (!selected) {
                setError("آدرس انتخاب‌شده نامعتبر است.");
                return;
            }
            shippingAddressPayload = {
                name: selected.fullname || form.name,
                family: selected.family || "",
                phone: selected.phone,
                province: selected.province,
                city: selected.city,
                address: selected.address,
                postal_code: selected.postal_code || ""
            };
        } else {
            // مهمان: از فرم استفاده می‌کنیم؛ کاربر باید فرم را پر کند
            if (!validateAddress()) return;
            shippingAddressPayload = {
                name: form.name,
                family: form.family,
                phone: form.phone,
                province: form.province,
                city: form.city,
                address: form.address,
                postal_code: form.postal_code || ""
            };
        }
        if (!agree) {
            setError("لطفاً قوانین را بپذیرید.");
            return;
        }
        console.log(cartItems)
        const payload = {
            items: (cartItems || []).map(it => ({

                product_id: it.id,
                quantity: it.quantity
            })),
            shipping_address: shippingAddressPayload,
            payment_method: "zarinpal", // یا "cash" اگر خواستی
            shipping_cost: shippingCost
        };

        setLoading(true);
        try {
            const headers = { "Content-Type": "application/json" };
            if (token) headers.Authorization = `Bearer ${token}`;

            const res = await axios.post(`${baseURL}/orders/create`, payload, { headers, timeout: 20000 });

            if (res.data && res.data.success) {
                // اگر توکن جدید و user برگشته (سرور ممکنه کاربر بسازه)
                if (res.data.token && res.data.user && typeof setAuth === "function") {
                    setAuth({ token: res.data.token, user: res.data.user });
                }

                // اگر لینک پرداخت برگردانده شد -> هدایت به درگاه
                if (res.data.payment_url) {
                    // در حالت پرداخت آنلاین، سبد را پاک نکن تا در callback پاک شود
                    window.location.href = res.data.payment_url;
                    return;
                }

                // اگر پرداخت نقدی یا پیامی بدون payment_url
                clearCart();
                navigate(`/payment-success?order=${res.data.order_id}`);
            } else {
                setError(res.data.message || "خطا در ایجاد سفارش");
            }
        } catch (err) {
            console.error("Create order error:", err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || JSON.stringify(err.response.data));
            } else {
                setError("خطا در اتصال به سرور");
            }
        } finally {
            setLoading(false);
        }
    };

    // UI
    return (
        <div className="container mx-auto px-6 py-8 mt-12" dir="rtl">
            <div className="max-w-6xl mx-auto">


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* فرم سمت راست */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">جزئیات ارسال</h3>

                            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

                            {/* اگر کاربر لاگین و آدرس‌ها لود شده */}
                            {user && (
                                <div className="mb-4">
                                    <div className="mb-2 text-sm text-gray-600">آدرس‌های شما</div>
                                    {loadingAddresses ? (
                                        <div className="p-4 bg-gray-50 rounded">در حال بارگذاری آدرس‌ها...</div>
                                    ) : addresses.length === 0 ? (
                                        <div className="p-4 bg-yellow-50 rounded">
                                            هنوز آدرسی ثبت نکرده‌اید. <button onClick={() => setShowAddressForm(true)} className="text-blue-600 underline">افزودن آدرس</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 mb-3">
                                            {addresses.map(a => (
                                                <label key={a.id} className={`flex items-start gap-3 p-3 rounded border ${selectedAddressId === a.id ? "border-red-500 bg-red-50" : "border-gray-100"}`}>
                                                    <input
                                                        type="radio"
                                                        name="selected_address"
                                                        checked={selectedAddressId === a.id}
                                                        onChange={() => setSelectedAddressId(a.id)}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-medium">{a.fullname} — {a.phone}</div>
                                                        <div className="text-sm text-gray-600">{a.province} / {a.city}</div>
                                                        <div className="text-sm text-gray-500 mt-2">{a.address}</div>
                                                        {a.postal_code && <div className="text-xs text-gray-400 mt-1">کدپستی: {a.postal_code}</div>}
                                                    </div>
                                                </label>
                                            ))}
                                            <div>
                                                <button onClick={() => setShowAddressForm(true)} className="text-sm text-blue-600 underline">افزودن آدرس جدید</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* فرم آدرس (قابل استفاده برای مهمان یا افزودن آدرس جدید) */}
                            {(!user || showAddressForm) && (
                                <form onSubmit={handleSaveAddress}>
                                    <h4 className="text-md font-medium mb-2">اطلاعات گیرنده</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            placeholder="نام *"
                                            className="border rounded px-3 py-2"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="نام خانوادگی *"
                                            className="border rounded px-3 py-2"
                                            value={form.family}
                                            onChange={(e) => setForm({ ...form, family: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="شماره همراه *"
                                            className="border rounded px-3 py-2"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                        <select className="border rounded px-3 py-2" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>
                                            <option>فارس</option>
                                            <option>تهران</option>
                                            <option>اصفهان</option>
                                            <option>البرز</option>
                                        </select>

                                        <select className="border rounded px-3 py-2" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                                            <option>شیراز</option>
                                            <option>تهران</option>
                                            <option>اصفهان</option>
                                        </select>

                                        <input type="text" placeholder="کد پستی (اختیاری)" className="border rounded px-3 py-2"
                                               value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
                                    </div>

                                    <div className="mt-3">
                                        <textarea rows={3} className="border rounded w-full p-2" placeholder="آدرس دقیق *" value={form.address}
                                                  onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                                    </div>

                                    <div className="flex items-center gap-3 mt-3">
                                        {/* اگر کاربر لاگین است، ارسال آدرس برای ذخیره، وگرنه فقط فرم مهمان */}
                                        {user ? (
                                            <>
                                                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                                                    {loading ? "در حال ذخیره..." : "ذخیره آدرس"}
                                                </button>
                                                <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 rounded border">
                                                    انصراف
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-sm text-gray-500">
                                                فرم برای پرداخت مهمان استفاده می‌شود. (پس از پرداخت، ممکن است حساب مهمان ایجاد شود)
                                            </div>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* خلاصه سفارش سمت چپ */}
                    <div className="lg:col-span-4">
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="text-sm text-gray-500 mb-4">قیمت کالا(ها)</div>
                                <div className="space-y-3">
                                    {(cartItems || []).map(it => (
                                        <div key={it.id} className="flex items-center gap-3">
                                            <img src={resolveImage(it.images?.[0] || it.image)} alt={it.name} className="w-16 h-16 object-contain rounded" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{it.name}</div>
                                                <div className="text-xs text-gray-500">تعداد: {it.quantity}</div>
                                            </div>
                                            <div className="text-sm font-semibold">{Number(it.price).toLocaleString()} تومان</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 border-t pt-4">
                                    <div className="flex justify-between mb-2">
                                        <div className="text-gray-500 text-sm">جمع کالاها</div>
                                        <div className="font-semibold">{subtotal.toLocaleString()} تومان</div>
                                    </div>

                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="text-sm text-gray-500">حمل و نقل</div>
                                            <div className="text-xs text-gray-400">هزینه ثابت</div>
                                        </div>
                                        <div className="font-semibold">{shippingCost.toLocaleString()} تومان</div>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center pt-3 border-t">
                                        <div className="text-lg font-bold">مجموع</div>
                                        <div className="text-lg font-bold text-red-600">{total.toLocaleString()} تومان</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <h4 className="text-sm font-semibold mb-3">پرداخت امن</h4>
                                <p className="text-xs text-gray-500 mb-4">پرداخت امن از طریق کلیه کارت‌های عضو شتاب و درگاه زرین‌پال.</p>

                                <label className="flex items-start gap-2 mb-4">
                                    <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} className="h-4 w-4" />
                                    <div className="text-xs text-gray-600">من قوانین و مقررات را خواندم و آن را می‌پذیرم.</div>
                                </label>

                                <div className="text-right">
                                    <button onClick={handlePayment} disabled={loading} className={`w-full py-3 rounded text-white font-semibold ${loading ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}>
                                        {loading ? "در حال ایجاد سفارش..." : "پرداخت با زرین‌پال"}
                                    </button>
                                </div>
                            </div>

                            <div className="text-right text-sm text-gray-500">
                                <button onClick={() => navigate("/cart")} className="text-gray-700 hover:text-gray-900">بازگشت به سبد خرید</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-8" />
            </div>
        </div>
    );
}
