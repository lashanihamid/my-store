import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import baseURL from "../config.js";
import Header from "../components/Header.jsx";
const ArticlesPage = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetch(`${baseURL}/articles`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setArticles(data.data.data); // توجه به ساختار pagination
            })
            .catch((err) => console.error("خطا در دریافت مقاله‌ها:", err));
    }, []);

    return (
        <div>
            <Header />

        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">مقالات</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <div key={article.id} className="border rounded-lg shadow-sm p-4">
                        <img
                            src={`${baseURL.replace("/api", "")}${article.image}`}
                            alt={article.title}
                            className="w-full h-48 object-cover rounded mb-4"
                        />
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">
                            {article.title}
                        </h2>
                        <p
                            className="text-sm text-gray-600 mb-4 line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                        <Link
                            to={`/article/${article.id}`}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            ادامه مطلب
                        </Link>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default ArticlesPage;