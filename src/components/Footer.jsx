import React, { useState } from "react";
import { FaInstagram, FaTelegramPlane, FaYoutube, FaLinkedin, FaWhatsapp, FaFacebookF } from "react-icons/fa";

const Footer = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();

        // --- اینجا بعداً API خبرنامه اضافه میشه ---
        alert(`ایمیل ${email} ثبت شد ✅`);
        setEmail("");
    };

    return (
        <footer className="bg-white mt-10 border-t pt-10 text-sm text-gray-700">

            {/* آیتم‌های بالای فوتر */}
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-6 py-6 border-b">
                <div>
                    <img src="https://img.icons8.com/ios-filled/50/ea9b25/ok.png" alt="ضمانت" className="mx-auto" />
                    <p>ضمانت اصالت کالا</p>
                </div>
                <div>
                    <img src="https://img.icons8.com/ios-filled/50/ea9b25/return.png" alt="بازگشت وجه" className="mx-auto" />
                    <p>ضمانت بازگشت وجه</p>
                </div>
                <div>
                    <img src="https://img.icons8.com/ios-filled/50/ea9b25/delivery.png" alt="ارسال سریع" className="mx-auto" />
                    <p>ارسال سریع کالا</p>
                </div>
                <div>
                    <img src="https://img.icons8.com/ios-filled/50/ea9b25/handshake.png" alt="ایران" className="mx-auto" />
                    <p>ایران سرای ماست</p>
                </div>
            </div>

            {/* بخش وسط */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between py-10 gap-10">

                {/* خبرنامه + شبکه اجتماعی */}
                <div className="text-center md:w-1/3">
                    <h3 className="font-bold text-gray-900 mb-3">با ما همراه باشید</h3>
                    <div className="flex justify-center gap-4 text-2xl mb-4">
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaTelegramPlane /></a>
                        <a href="#"><FaYoutube /></a>
                        <a href="#"><FaLinkedin /></a>
                        <a href="#"><FaWhatsapp /></a>
                        <a href="#"><FaFacebookF /></a>
                    </div>

                </div>

                {/* منوها */}
                <div className="grid grid-cols-2 gap-10 text-right md:w-2/3">
                    <div>
                        <h4 className="font-bold mb-3">راهنمای خرید</h4>
                        <ul className="space-y-2">
                            <li><a href="#">راهنمای خرید</a></li>
                            <li><a href="#">روش‌های ارسال</a></li>
                            <li><a href="#">روش‌های پرداخت</a></li>
                            <li><a href="#">رویه‌های بازگرداندن کالا</a></li>
                            <li><a href="#">شرایط و قوانین</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-3">خدمات</h4>
                        <ul className="space-y-2">
                            <li><a href="#">پیگیری سفارشات</a></li>
                            <li><a href="#">حریم خصوصی</a></li>
                            <li><a href="#">پرسش‌های متداول</a></li>
                            <li><a href="#">تماس با ما</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* نماد + کپی رایت */}
            <div className="text-center border-t py-6 text-gray-600">
                <a referrerPolicy="origin" target="_blank"
                   href="https://trustseal.enamad.ir/?id=344084&amp;Code=7nxcaE5cCawhVphMh2ex"><img
                    referrerPolicy="origin"
                    src="https://Trustseal.eNamad.ir/logo.aspx?id=344084&amp;Code=7nxcaE5cCawhVphMh2ex" alt=""
                    id="7nxcaE5cCawhVphMh2ex"/></a>
                <p>کلیه حقوق محفوظ است © 2025</p>
            </div>
        </footer>
    );
};

export default Footer;
