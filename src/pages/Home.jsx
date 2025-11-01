import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import BannerSlider from "../components/BannerSlider";
import CategorySlider from "../components/CategorySlider";
import CategoryGrid from "../components/CategoryGrid";
import CategoryProducts from "../components/CategoryProducts";
import Header from "../components/Header.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import baseURL from "../config.js";
import ArticleSlider from "../components/ArticleSlider";
import { useSiteSettings } from "../context/SiteSettingsContext.jsx";



const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { settings } = useSiteSettings();
    console.log('category',settings)

    const hideLayoutRoutes = ["/login"];
    const hideLayout = hideLayoutRoutes.includes(location.pathname);


    useEffect(() => {
        fetch(`${baseURL}/products`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProducts(data.data);
                } else {
                    setError("مشکلی در دریافت محصولات وجود دارد.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("ارتباط با سرور برقرار نشد!");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="text-center text-lg mt-10">در حال دریافت محصولات...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600 mt-10">{error}</p>;
    }

    return (

        <div className="max-w mx-auto"
             style={{ backgroundImage: `url(${settings.site_url}/${settings.main_bg})`,
             }}
        >

            {!hideLayout && <Header />}
            {settings.show_category_slider === "1" && <CategorySlider />}



            <BannerSlider />
            <div className="container mx-auto px-5 py-10 md:rounded-lg text-white mt-4"
                 style={{ backgroundColor: settings.latest_products_bg }}

            >


                <h2 className="text-lg font-bold pb-4 mb-4 border-b-2">
                جدیدترین محصولات
            </h2>

            {products.length === 0 ? (
                <p className="text-center text-gray-600">هیچ محصولی یافت نشد!</p>
            ) : (
                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation
                    loop
                    autoplay={{ delay: 3000 }}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                >
                    {products.map((item) => (
                        <SwiperSlide key={item.id}>
                            <ProductCard product={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>

            )}
            </div>

            <CategoryGrid />
            <CategoryProducts />

            <ArticleSlider />


        </div>
    );
};

export default Home;
