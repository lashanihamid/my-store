// src/pages/ProductDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-jalaali";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";
import baseURL from "../config.js";
import baseURL_image from "../URL_image.js";
import { FaHeart, FaShareAlt, FaStar } from "react-icons/fa";
import Header from "../components/Header.jsx";
const DEFAULT_IMG = `${baseURL_image}/no-image.png`;

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(null);
    const [related, setRelated] = useState([]);
    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);

    // انتخاب کاربر برای هر attribute: { [attributeId]: valueId }
    const [selectedOptions, setSelectedOptions] = useState({});
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        let mounted = true;

        async function fetchProduct() {
            setLoading(true);
            try {
                const res = await axios.get(`${baseURL}/products/${id}`);
                const json = res.data;
                if (!mounted) return;

                if (json?.success && json.data) {
                    const p = json.data;

                    const imgs = Array.isArray(p.images) && p.images.length
                        ? p.images.map(img => {
                            if (!img) return DEFAULT_IMG;
                            return img.startsWith("http") ? img : (img.startsWith("/") ? baseURL + img : baseURL + "/" + img);
                        })
                        : [DEFAULT_IMG];

                    const variants = Array.isArray(p.variants)
                        ? p.variants.map(v => ({
                            ...v,
                            price: Number(v.price || 0),
                            stock: v.stock ?? 0,
                            attribute_values: Array.isArray(v.attribute_values) ? v.attribute_values : []
                        }))
                        : [];

                    const normalized = {
                        ...p,
                        images: imgs,
                        price_num: Number(p.price || 0),
                        discount_price_num: Number(p.discount_price || 0),
                        variants
                    };

                    setProduct(normalized);
                    setMainImage(imgs[0]);
                    const catId = p.categories?.[0]?.id;
                    if (catId) fetchRelated(catId);
                } else {
                    setProduct(null);
                }
            } catch (err) {
                console.error("fetchProduct error:", err);
                setProduct(null);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        async function fetchRelated(categoryId) {
            try {
                const res = await axios.get(`${baseURL}/categories/${categoryId}/products`);
                const json = res.data;
                if (json?.products) {
                    setRelated(json.products.slice(0, 10));
                }
            } catch (err) {
                console.error("fetchRelated error:", err);
            }
        }

        fetchProduct();
        return () => (mounted = false);
    }, [id]);

    // استخراج attributes از variants
    const attributes = useMemo(() => {
        if (!product?.variants) return [];
        const map = new Map();
        product.variants.forEach((v) => {
            (v.attribute_values || []).forEach((av) => {
                const attrId = av.attribute?.id;
                if (!attrId) return;
                if (!map.has(attrId)) {
                    map.set(attrId, { id: attrId, name: av.attribute?.name || "ویژگی", values: new Map() });
                }
                map.get(attrId).values.set(av.id, { id: av.id, value: av.value });
            });
        });
        return Array.from(map.values()).map(a => ({
            id: a.id,
            name: a.name,
            values: Array.from(a.values.values())
        }));
    }, [product]);

    const variants = product?.variants || [];

    const getMatchingVariants = (selOptions) => {
        const entries = Object.entries(selOptions).map(([k, v]) => [Number(k), v]);
        if (!entries.length) return variants.slice();
        return variants.filter((v) =>
            entries.every(([attrId, valId]) =>
                (v.attribute_values || []).some((av) => av.attribute?.id === attrId && av.id === valId)
            )
        );
    };

    // برای یک attribute مشخص، محاسبه لیست valueId های قابل انتخاب براساس انتخاب های فعلی به‌جز این attribute
    const getAvailableValueIdsForAttr = (attrId) => {
        const sel = { ...selectedOptions };
        delete sel[attrId];
        const matched = getMatchingVariants(sel);
        const ids = new Set();
        matched.forEach((v) => {
            (v.attribute_values || []).forEach((av) => {
                if (av.attribute?.id === attrId) ids.add(av.id);
            });
        });
        if (ids.size === 0) {
            const attr = attributes.find(a => a.id === attrId);
            return attr ? attr.values.map(v => v.id) : [];
        }
        return Array.from(ids);
    };

    useEffect(() => {
        const matched = getMatchingVariants(selectedOptions);
        if (matched.length === 1) setSelectedVariant(matched[0]);
        else setSelectedVariant(null);
    }, [selectedOptions, product]);

    const handleSelectValue = (attrId, valId) => {
        setSelectedOptions(prev => {
            const next = { ...prev, [attrId]: valId };
            return next;
        });
    };

    const formatPrice = (value) => Number(value || 0).toLocaleString();

    const handleAddToCart = () => {
        if (!product) return;
        if (variants.length > 0 && !selectedVariant) {
            toast.error("لطفا یک ترکیب از ویژگی‌ها را انتخاب کنید");
            return;
        }
        setAdding(true);
        const item = {
            id: selectedVariant ? `v-${selectedVariant.id}` : product.id,
            product_id: product.id,
            name: product.name,
            price: selectedVariant ? Number(selectedVariant.price) : Number(product.price_num),
            image: product.images?.[0] || DEFAULT_IMG,
            quantity: qty,
            variant_id: selectedVariant ? selectedVariant.id : null,
            attributes: selectedVariant ? selectedVariant.attribute_values : null
        };
        addToCart(item);
        setAdding(false);
        toast.success("به سبد اضافه شد");
    };

    const handleBuyNow = () => {
        if (!product) return;
        if (variants.length > 0 && !selectedVariant) {
            toast.error("برای خرید مستقیم ابتدا یک ترکیب را انتخاب کنید");
            return;
        }
        handleAddToCart();
        navigate("/checkout");
    };

    const onShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: product?.name || "محصول", url });
            } catch {}
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success("پیوند کپی شد");
            } catch {
                toast.error("امکان کپی پیوند فراهم نیست");
            }
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6" dir="rtl">
                <div className="bg-white shadow rounded p-6 text-center">در حال بارگذاری...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto p-6" dir="rtl">
                <div className="bg-white shadow rounded p-6 text-center text-red-600">محصولی یافت نشد</div>
            </div>
        );
    }

    return (
        <div>
            <Header/>
            <div className="container mx-auto px-5 py-10" dir="rtl">
                <nav className="text-sm mb-4" aria-label="breadcrumb">
                    <ol className="flex gap-2 items-center text-gray-600">
                        <li><Link to="/" className="hover:underline">خانه</Link></li>
                        <li className="px-2">/</li>
                        {product.categories?.map((c, idx) => (
                            <li key={c.id}>
                                <Link to={`/category/${c.id}`} className="hover:underline">{c.name}</Link>
                                {idx !== product.categories.length - 1 && <span className="px-2">/</span>}
                            </li>
                        ))}
                        <li className="text-gray-500">/ {product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-6 bg-white rounded shadow p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <img src={mainImage || DEFAULT_IMG} alt={product.name}
                                     className="w-full h-96 object-contain bg-gray-50 rounded"/>
                            </div>

                            <div className="w-28 hidden md:block">
                                <div className="space-y-3">
                                    {product.images.map((img, i) => (
                                        <button key={i} onClick={() => setMainImage(img)}
                                                className={`w-full h-20 p-1 rounded border ${mainImage === img ? "border-red-500" : "border-gray-200"}`}
                                                aria-label={`thumb-${i + 1}`}>
                                            <img src={img || DEFAULT_IMG} alt={`thumb-${i}`}
                                                 className="w-full h-full object-contain"/>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 md:hidden flex gap-2 overflow-x-auto">
                            {product.images.map((img, i) => (
                                <button key={i} onClick={() => setMainImage(img)}
                                        className={`flex-none p-1 rounded border ${mainImage === img ? "border-red-500" : "border-gray-200"}`}>
                                    <img src={img || DEFAULT_IMG} alt={`thumb-${i}`}
                                         className="w-20 h-16 object-contain"/>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-6 bg-white rounded shadow p-6 flex flex-col justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

                            <div className="mt-4 mb-4 text-sm text-gray-700">
                                {product.description && <p>{product.description}</p>}
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <FaStar key={i}
                                                className={`text-lg ${i <= Math.round(product.average_rating || 0) ? "text-yellow-500" : "text-gray-300"}`}/>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-500">
                                    امتیاز: {product.average_rating || 0} ({product.ratings_count || 0})
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                {variants.length > 0 ? (
                                    selectedVariant ? (
                                        <div
                                            className="text-2xl font-bold text-red-600">{formatPrice(selectedVariant.price)} تومان</div>
                                    ) : (
                                        <div className="text-gray-500 text-sm">برای نمایش قیمت یکی از متغیرها را انتخاب
                                            کنید</div>
                                    )
                                ) : (
                                    <>
                                        <div
                                            className="text-2xl font-bold text-red-600">{formatPrice(product.price_num)} تومان
                                        </div>
                                        {product.discount_price_num > 0 && <div
                                            className="text-sm text-gray-400 line-through">{formatPrice(product.discount_price_num)} تومان</div>}
                                    </>
                                )}
                            </div>

                            {variants.length === 0 && (
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className={`px-2 py-1 rounded text-sm ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                        {product.stock > 0 ? "موجود" : "ناموجود"}
                                    </div>
                                    {product.sku && <div className="text-sm text-gray-500">SKU: {product.sku}</div>}
                                </div>
                            )}

                            {/* SELECT per attribute - FLEX */}
                            {attributes.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {attributes.map(attr => {
                                            const availableIds = getAvailableValueIdsForAttr(attr.id);
                                            const valueList = attr.values || [];
                                            return (
                                                <div key={attr.id} className="min-w-[220px] flex-shrink-0">
                                                    <div className="font-medium mb-2">{attr.name}</div>
                                                    <select
                                                        value={selectedOptions[attr.id] ?? ""}
                                                        onChange={(e) => {
                                                            const val = e.target.value ? Number(e.target.value) : "";
                                                            if (val === "") {
                                                                setSelectedOptions(prev => {
                                                                    const next = {...prev};
                                                                    delete next[attr.id];
                                                                    return next;
                                                                });
                                                            } else {
                                                                handleSelectValue(attr.id, val);
                                                            }
                                                        }}
                                                        className="w-full border rounded p-2"
                                                    >
                                                        <option value="">انتخاب {attr.name}</option>
                                                        {valueList.map(val => {
                                                            const disabled = !availableIds.includes(val.id);
                                                            return (
                                                                <option key={val.id} value={val.id} disabled={disabled}>
                                                                    {val.value}{disabled ? " (ناموجود)" : ""}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            {/* ========== END SELECT per attribute ========== */}

                        </div>

                        <div className="mt-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center border rounded">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2">-
                                    </button>
                                    <div className="px-4">{qty}</div>
                                    <button onClick={() => setQty(q => q + 1)} className="px-3 py-2">+</button>
                                </div>

                                <button onClick={handleAddToCart} disabled={adding}
                                        className={`bg-red-600 text-white px-4 py-2 rounded font-semibold ${adding ? "opacity-70" : "hover:bg-red-700"}`}>
                                    {adding ? "در حال افزودن..." : "افزودن به سبد"}
                                </button>

                                <button onClick={handleBuyNow}
                                        className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold hover:brightness-95">
                                    خرید سریع
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <button onClick={() => alert("محبوب شد (مثال)")}
                                        className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50">
                                    <FaHeart className="text-red-500"/> افزودن به علاقه‌مندی
                                </button>
                                <button onClick={onShare}
                                        className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50">
                                    <FaShareAlt/> اشتراک‌گذاری
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {related && related.length > 0 && (
                    <div className="mt-10">
                        <h3 className="text-xl font-bold mb-4">محصولات مرتبط</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {related.map(item => (
                                <div key={item.id} className="p-3 bg-white rounded shadow hover:shadow-lg transition">
                                    <Link to={`/product/${item.id}`}>
                                        <img
                                            src={item.images?.[0] || (item.image ? (item.image.startsWith("http") ? item.image : baseURL_image + item.image) : DEFAULT_IMG)}
                                            alt={item.name} className="w-full h-36 object-contain mb-2"/>
                                        <div className="text-sm font-medium h-12 overflow-hidden">{item.name}</div>
                                    </Link>
                                    <div className="flex items-center justify-between mt-2">
                                        <div
                                            className="text-red-600 font-semibold">{Number(item.price).toLocaleString()} تومان
                                        </div>
                                        <button onClick={() => addToCart({
                                            id: item.id,
                                            name: item.name,
                                            price: Number(item.price),
                                            images: item.images || [item.image],
                                            quantity: 1
                                        })} className="px-3 py-1 bg-green-600 text-white rounded text-xs">افزودن
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 border-t pt-4 text-sm text-gray-600">
                    <div className="mb-2">دسته‌بندی‌ها: {product.categories?.map(c => <Link key={c.id}
                                                                                            to={`/category/${c.id}`}
                                                                                            className="text-blue-600 hover:underline ml-2">{c.name}</Link>)}</div>
                    <div>تاریخ اضافه شدن: {moment(product.created_at).format("jYYYY/jMM/jDD")}</div>
                </div>

                <ToastContainer/>
            </div>
        </div>
            );
            }