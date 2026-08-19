// app/privacy/page.jsx

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-8 mt-10">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: August 17, 2026</p>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">1. Introduction</h3>
        <p>At <strong>Kripalni Tarot Trader</strong>, we value your privacy. This policy explains how we handle your personal information.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">2. Information We Collect</h3>
        <p>We may collect your name, email address, phone number, and transaction details when you use our services or make a purchase.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">3. How We Use Your Data</h3>
        <p>Your details are used solely to deliver our services, process secure payments via Razorpay/Stripe, and communicate order updates.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">4. Contact Us</h3>
        <p>For any privacy-related queries, reach out to us at: <strong>khushii27sharma@gmail.com</strong>.</p>
      </section>
    </div>
  );
}