import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import  baseURL from "../config.js";
import baseURL_image from "../URL_image.js"
const CategorySlider = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${baseURL}/categories`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setCategories(data.data);
                }
            })
            .catch((err) => console.log("Error loading categories:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="container bg-white mt-4 rounded-xl shadow-xl mx-auto px-5 py-6">
            <Swiper
                modules={[Navigation]}
                loop
                spaceBetween={6}
                slidesPerView={6}
                breakpoints={{
                    320: { slidesPerView: 3 },
                    640: { slidesPerView: 4 },
                    1024: { slidesPerView: 8 },
                }}
            >
                {loading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <SwiperSlide key={index} className="text-center">
                            <div className="flex flex-col items-center animate-pulse">
                                <div className="w-48 h-48 bg-gray-300 rounded-full"></div>
                                <div className="w-16 h-4 bg-gray-300 rounded mt-2"></div>
                            </div>
                        </SwiperSlide>
                    ))
                    : categories.map((cat) => (
                        <SwiperSlide key={cat.id} className="text-center cursor-pointer">
                            <a href={`/category/${cat.id}`} className="flex flex-col items-center">
                                <img
                                    src={`${baseURL_image}/${cat.image}`}
                                    alt={cat.name}
                                    className="w-48 md:h-48 object-cover rounded-full border-2 border-red-500 p-1 hover:scale-105 transition"
                                />
                                <p className="mt-2 text-sm">{cat.name}</p>
                            </a>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default CategorySlider;
