// app/terms/page.jsx

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto p-8 mt-10">
      <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: August 17, 2026</p>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">1. Introduction</h3>
        <p>Welcome to <strong>Kripalni Tarot Trader</strong>. By using our services, you agree to comply with these terms. We operate as an independent professional service provider.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">2. Nature of Services</h3>
        <p>Kripalni Tarot Trader provides tarot reading and spiritual insights for personal guidance and entertainment purposes. We do not provide professional financial or legal advice.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">3. Payments</h3>
        <p>Payments are handled securely via Razorpay/Stripe. By initiating a transaction, you confirm that you are authorized to use the payment method.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">4. Limitation of Liability</h3>
        <p>As an independent service provider, our liability is limited to the amount paid for the specific service rendered. We are not responsible for any outcomes resulting from your reliance on our readings.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">5. Contact Information</h3>
        <p>If you have any questions, you can reach out directly to our support email: <strong>khushii27sharma@gmail.com</strong>.</p>
      </section>
    </div>
  );
}