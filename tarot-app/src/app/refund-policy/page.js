// app/refund-policy/page.jsx

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-8 mt-10">
      <h1 className="text-4xl font-bold mb-4">Refund and Cancellation Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: August 17, 2026</p>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">1. Cancellation Policy</h3>
        <p>At <strong>Kripalni Tarot Trader</strong>, cancellations must be requested at least <strong>24 hours</strong> prior to the scheduled service time. Once a digital session or reading is completed, it cannot be cancelled.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">2. Refund Policy</h3>
        <p>Refunds are evaluated case-by-case and are generally provided only in cases of duplicate billing or technical transaction errors.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">3. Contact Us</h3>
        <p>To request a refund or raise a query, email us with your transaction details at: <strong>khushii27sharma@gmail.com</strong>.</p>
      </section>
    </div>
  );
}