import React from "react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext.jsx";
import TiltedCard from '../components/TiltedCard';
import '../components/TiltedCard.css';
import GlareHover from '../components/GlareHover'
import '../components/GlareHover.css';
const CategoryGrid = () => {
    const { settings, loading } = useSiteSettings();

    if (loading) return null;

    let categories = [];
    try {
        categories = JSON.parse(settings.car_categories);
    } catch (err) {
        console.error("خطا در تبدیل car_categories به آرایه:", err);
    }
    if (!Array.isArray(categories) || categories.length === 0) return null;

    return (
        <div className="container p-4  md:p-0 mx-auto mb-4  mt-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5">
                {categories.map((cat, index) => (
                   <Link
                        to={`/category/${cat.category_id || cat.slug}`}
                        key={index}
                        className="overflow-hidden rounded-xl"
                    >
				   <GlareHover
    rotateAmplitude={10}
    glareColor="rgba(255,255,255,0.4)"
    scaleOnHover={1.05}
  >
  <TiltedCard
            key={index}
            imageSrc={`${settings.site_url}/${cat.image}`}
            altText={`${cat.title}`}
            captionText=""
            containerHeight="300px"
            containerWidth="100%"
            imageHeight="300px"
            imageWidth="100%"
            rotateAmplitude={12}
            scaleOnHover={1}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={
              <p className="tilted-card-demo-text">
                
              </p>
            }
          />
		  </GlareHover>
		  </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryGrid;