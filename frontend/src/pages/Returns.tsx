import ScrollReveal from '../components/ScrollReveal';

export default function Returns() {
  return (
    <div className="pt-20">
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brown-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl lg:text-6xl text-cream-100 mb-6">
            Return & Refund Policy
          </h1>
        </div>
      </section>

      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brown-800 prose-p:text-brown-600">
              <p className="text-sm text-brown-500 mb-8">Last updated: February 8, 2026</p>

              <h2>1. Product Returns</h2>
              <p>
                We want you to be completely satisfied with your purchase. If you're not happy with 
                a product, we accept returns under the following conditions:
              </p>
              <ul>
                <li>Items must be returned within 14 days of purchase</li>
                <li>Products must be unopened, unused, and in original packaging</li>
                <li>Proof of purchase (receipt or order confirmation) is required</li>
                <li>Sale items are final sale and cannot be returned</li>
              </ul>

              <h2>2. Non-Returnable Items</h2>
              <p>The following items cannot be returned:</p>
              <ul>
                <li>Opened or used products</li>
                <li>Gift cards and prepaid packages</li>
                <li>Personal care items (for hygiene reasons)</li>
                <li>Items marked as "Final Sale"</li>
              </ul>

              <h2>3. How to Return</h2>
              <p>To initiate a return:</p>
              <ol>
                <li>Contact us at info@rjbeautylounge.com or +971 50 903 9020</li>
                <li>Provide your order number and reason for return</li>
                <li>We will provide a return authorization and instructions</li>
                <li>Ship the item back to us in its original packaging</li>
              </ol>

              <h2>4. Refunds</h2>
              <ul>
                <li>Refunds will be processed within 5-7 business days of receiving the returned item</li>
                <li>Refunds will be issued to the original payment method</li>
                <li>Shipping costs are non-refundable unless the return is due to our error</li>
                <li>You will receive an email confirmation once your refund is processed</li>
              </ul>

              <h2>5. Exchanges</h2>
              <p>
                We currently do not offer direct exchanges. If you wish to exchange an item, 
                please return the original item for a refund and place a new order for the desired item.
              </p>

              <h2>6. Damaged or Defective Items</h2>
              <p>
                If you receive a damaged or defective product, please contact us within 48 hours 
                of delivery with photos of the damage. We will arrange a replacement or full refund 
                at no additional cost.
              </p>

              <h2>7. Service Cancellations & Refunds</h2>
              <ul>
                <li>Cancellations made 24+ hours before appointment: Full refund</li>
                <li>Cancellations made 12-24 hours before appointment: 50% refund</li>
                <li>Cancellations made less than 12 hours before appointment: No refund</li>
                <li>No-shows: No refund</li>
              </ul>

              <h2>8. Contact Us</h2>
              <p>
                For any questions about returns or refunds:
                <br />
                Email: info@rjbeautylounge.com
                <br />
                Phone: +971 50 903 9020
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
