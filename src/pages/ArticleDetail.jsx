import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import baseURL from "../config.js";
import Header from "../components/Header.jsx";

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`${baseURL}/articles/${id}`);
                const data = await res.json();
                if (data.success) setArticle(data.data);
            } catch (err) {
                console.error("خطا در دریافت مقاله:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchRelated = async () => {
            try {
                const res = await fetch(`${baseURL}/articles`);
                const data = await res.json();
                if (data.success) setRelatedArticles(data.data.data);
            } catch (err) {
                console.error("خطا در دریافت مقالات مرتبط:", err);
            }
        };

        fetchArticle();
        fetchRelated();
    }, [id]);

    if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;
    if (!article) return <div className="text-center py-10 text-red-500">مقاله یافت نشد.</div>;

    return (
        <div>
            <Header />
            <div className="shadow-lg container mx-auto p-4 mt-4">{/* breadcrumb */}
                <nav className="text-sm text-gray-500 mb-4">
                    <Link to="/" className="hover:underline font-bold">خانه</Link> &gt;{" "}
                    <Link to="/articles" className="hover:underline font-bold">مقالات</Link> &gt;{" "}
                    <span className="text-gray-700">{article.title}</span>
                </nav></div>
            <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                {/* مقاله اصلی */}
                <main className="md:w-3/4 bg-white p-6 rounded shadow">


                    {/* تصویر مقاله */}
                    {article.image && (
                        <img
                            src={`${baseURL.replace("/api", "")}${article.image}`}
                            alt={article.title}
                            className="w-full h-auto rounded-md mb-6"
                        />
                    )}

                    {/* عنوان و اطلاعات نویسنده */}
                    <h1 className="text-2xl font-bold mb-2 text-gray-800">{article.title}</h1>
                    <div className="text-sm text-gray-500 mb-4">
                        نویسنده: {article.author || "کانون شهر راز"} | تاریخ: {article.created_at?.slice(0, 10)}
                    </div>

                    {/* دسته‌بندی‌ها و تگ‌ها */}
                    <div className="text-sm text-gray-600 mb-4 flex flex-wrap gap-4">
                        {article.categories?.length > 0 && (
                            <div>
                                <span className="font-semibold">دسته‌بندی‌ها:</span>{" "}
                                {article.categories.map((cat) => cat.name).join("، ")}
                            </div>
                        )}
                        {article.tags?.length > 0 && (
                            <div>
                                <span className="font-semibold">تگ‌ها:</span>{" "}
                                {article.tags.map((tag) => tag.name).join("، ")}
                            </div>
                        )}
                    </div>

                    {/* متن مقاله */}
                    <div
                        className="text-gray-700 leading-relaxed whitespace-pre-line mb-6"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* اشتراک‌گذاری */}
                    <div className="flex gap-4 items-center mb-6">
                        <span className="text-sm font-semibold text-gray-600">اشتراک‌گذاری:</span>
                        <a href={`https://t.me/share/url?url=${window.location.href}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">تلگرام</a>
                        <a href={`https://wa.me/?text=${window.location.href}`} target="_blank" rel="noreferrer" className="text-green-500 hover:underline">واتساپ</a>
                        <button
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                            className="text-gray-700 hover:underline"
                        >
                            کپی لینک
                        </button>
                    </div>

                    {/* کامنت‌ها */}
                    <section className="mt-8">
                        <h3 className="text-lg font-bold mb-4 text-gray-700">ارسال نظر</h3>
                        <form className="space-y-4">
                            <input
                                type="text"
                                placeholder="نام شما"
                                className="w-full border rounded px-4 py-2"
                            />
                            <textarea
                                rows="4"
                                placeholder="متن نظر..."
                                className="w-full border rounded px-4 py-2"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                ارسال نظر
                            </button>
                        </form>
                    </section>
                </main>

                {/* سایدبار مطالب مرتبط */}
                <aside className="md:w-1/4">
                    <div className="sticky top-24 bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-bold mb-4 text-gray-700">مطالب مرتبط</h2>
                        <ul className="space-y-4">
                            {relatedArticles
                                .filter((a) => a.id !== article.id)
                                .slice(0, 6)
                                .map((a) => (
                                    <li key={a.id} className="flex items-center gap-3 border-b pb-2">
                                        <img
                                            src={`${baseURL.replace("/api", "")}${a.image}`}
                                            alt={a.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <Link
                                            to={`/article/${a.id}`}
                                            className="text-sm text-gray-600 hover:underline"
                                        >
                                            {a.title}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ArticleDetail;