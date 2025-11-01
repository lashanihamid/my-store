import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useSiteSettings } from "../context/SiteSettingsContext.jsx";
import baseURL from "../config.js";

const BannerSlider = () => {
    const { settings, loading } = useSiteSettings();
    let sliderImages = [];

    try {
        sliderImages = JSON.parse(settings.slider_images);
    } catch (err) {
        console.error("خطا در تبدیل slider_images به آرایه:", err);
    }
    // اگر هنوز تنظیمات در حال بارگذاری هستند یا بنرها وجود ندارند

    return (
        <div className="container mx-auto mt-5">
            <Swiper
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3500 }}
                loop={true}
                spaceBetween={10}
            >
                {Array.isArray(sliderImages) &&
                    sliderImages.map((banner, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={`${baseURL.replace("/api", "")}/${banner.replace(/\\/g, "")}`}
                                alt={`banner-${index}`}
                                className="w-full md:h-96 md:rounded-xl  object-cover"
                            />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
};

export default BannerSlider;