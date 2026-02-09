import ScrollReveal from '../components/ScrollReveal';

export default function Terms() {
  return (
    <div className="pt-20">
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brown-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl lg:text-6xl text-cream-100 mb-6">
            Terms & Conditions
          </h1>
        </div>
      </section>

      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brown-800 prose-p:text-brown-600">
              <p className="text-sm text-brown-500 mb-8">Last updated: February 8, 2026</p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using the R&J Beauty Lounge website and services, you agree to be bound 
                by these Terms & Conditions. If you do not agree with any part of these terms, please 
                do not use our services.
              </p>

              <h2>2. Services</h2>
              <p>
                R&J Beauty Lounge provides beauty, spa, and wellness services as described on our website. 
                All services are subject to availability and we reserve the right to modify or discontinue 
                any service without prior notice.
              </p>

              <h2>3. Booking & Cancellation Policy</h2>
              <ul>
                <li>Appointments can be booked online, by phone, or via WhatsApp</li>
                <li>A 20% deposit may be required for certain premium services</li>
                <li>Cancellations must be made at least 24 hours in advance for a full refund</li>
                <li>Late cancellations (within 24 hours) may be subject to a cancellation fee</li>
                <li>No-shows will be charged the full service amount</li>
              </ul>

              <h2>4. Payment Terms</h2>
              <ul>
                <li>All prices are in UAE Dirhams (USD) and inclusive of VAT</li>
                <li>Payment can be made via cash, credit/debit cards, or digital wallets</li>
                <li>Online payments are processed securely through Stripe</li>
                <li>Gift cards and loyalty points cannot be redeemed for cash</li>
              </ul>

              <h2>5. Health & Safety</h2>
              <p>
                Clients must inform us of any medical conditions, allergies, or sensitivities before 
                receiving services. We reserve the right to refuse service if we believe it may 
                compromise your health or safety.
              </p>

              <h2>6. Intellectual Property</h2>
              <p>
                All content on this website, including text, images, logos, and designs, is the property 
                of R&J Beauty Lounge and is protected by copyright and other intellectual property laws. 
                Unauthorized use is prohibited.
              </p>

              <h2>7. Limitation of Liability</h2>
              <p>
                R&J Beauty Lounge shall not be liable for any indirect, incidental, special, or 
                consequential damages arising from the use of our services. Our liability is limited 
                to the amount paid for the specific service.
              </p>

              <h2>8. Governing Law</h2>
              <p>
                These Terms & Conditions are governed by the laws of the United Arab Emirates. 
                Any disputes shall be resolved in the courts of Dubai.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms & Conditions at any time. Changes will be 
                effective immediately upon posting on our website. Continued use of our services 
                constitutes acceptance of the updated terms.
              </p>

              <h2>10. Contact Information</h2>
              <p>
                For questions about these Terms & Conditions, please contact us:
                <br />
                Email: info@rjbeautylounge.com
                <br />
                Phone: +971 50 903 9020
                <br />
                Address: Ground Floor, Marriott Hotel Al Jadaf, Dubai, UAE
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
