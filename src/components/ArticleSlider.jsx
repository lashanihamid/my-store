import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import baseURL from '../config.js';
import baseURL_image from '../URL_image.js';
import { useSiteSettings } from "../context/SiteSettingsContext.jsx";


const ArticleSlider = () => {
    const [articles, setArticles] = useState([]);
const { settings } = useSiteSettings();
    useEffect(() => {
        axios.get(`${baseURL}/articles?limit=12`)
            .then(res => {
                setArticles(res.data.data?.data || []);
            })
            .catch(err => {
                console.error('خطا در دریافت مقالات:', err);
            });
    }, []);

    return (
        <div className="max-w p-6">

            <div className="container mx-auto px-5 py-10 md:rounded-lg text-white mt-4"
                 style={{backgroundColor: settings.latest_articles_bg}}
            >
                <h2 className="text-lg font-bold pb-4 mb-4 border-b-2">آخرین مقالات</h2>
                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation
                    loop
                    autoplay={{delay: 3000}}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: {slidesPerView: 2},
                        768: {slidesPerView: 3},
                        1024: {slidesPerView: 4},
                    }}
                    dir="rtl"
                >
                    {Array.isArray(articles) && articles.map(article => (
                        <SwiperSlide key={article.id}>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                                <img
                                    src={article.image ? `${baseURL_image}/${article.image}` : '/default.jpg'}
                                    alt={article.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 text-right flex-grow flex flex-col justify-between">
                                    <div className="flex flex-col gap-2 text-right">
                                        <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                                        {article.meta_description ? (
                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                                {article.meta_description}
                                            </p>
                                        ) : (
                                            <div
                                                className="text-sm text-gray-600 leading-relaxed line-clamp-3"
                                                dangerouslySetInnerHTML={{__html: article.content.slice(0, 100) + '...'}}
                                            />
                                        )}
                                    </div>
                                    <a
                                        href={`/article/${article.id}`}
                                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium self-start"
                                    >
                                        مشاهده مقاله →
                                    </a>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            </div>
            );
            };

            export default ArticleSlider;