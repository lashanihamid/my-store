import React from "react";

export default function PaymentFail() {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1 style={{ color: "red" }}>❌ پرداخت ناموفق بود</h1>
            <p>در صورت کسر مبلغ، طی 72 ساعت به حساب شما بازگردانده می‌شود.</p>
            <a href="/cart" style={{ color: "blue", marginTop: "20px", display: "inline-block" }}>
                بازگشت به سبد خرید
            </a>
        </div>
    );
}
