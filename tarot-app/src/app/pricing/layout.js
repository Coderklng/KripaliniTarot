// ✅ CORRECT: Clean nested layout
import Script from 'next/script';

export default function PricingLayout({ children }) {
  return (
    <>
      {children}
      {/* Razorpay Script Load */}
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload" 
      />
    </>
  );
}