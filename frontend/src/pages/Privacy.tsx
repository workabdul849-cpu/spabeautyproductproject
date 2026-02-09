import ScrollReveal from '../components/ScrollReveal';

export default function Privacy() {
  return (
    <div className="pt-20">
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brown-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl lg:text-6xl text-cream-100 mb-6">
            Privacy Policy
          </h1>
        </div>
      </section>

      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brown-800 prose-p:text-brown-600">
              <p className="text-sm text-brown-500 mb-8">Last updated: February 8, 2026</p>

              <h2>1. Introduction</h2>
              <p>
                At R&J Beauty Lounge, we respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, store, and protect your information when you 
                use our website and services.
              </p>

              <h2>2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul>
                <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth</li>
                <li><strong>Booking Information:</strong> Service preferences, appointment history, staff preferences</li>
                <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely)</li>
                <li><strong>Usage Data:</strong> Website browsing behavior, device information, IP address</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Process and manage your bookings</li>
                <li>Provide personalized services and recommendations</li>
                <li>Process payments and send invoices</li>
                <li>Send appointment reminders and confirmations</li>
                <li>Communicate promotions and special offers (with your consent)</li>
                <li>Improve our services and website experience</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data 
                against unauthorized access, alteration, disclosure, or destruction. All payment information 
                is encrypted and processed through secure payment gateways.
              </p>

              <h2>5. Data Sharing</h2>
              <p>
                We do not sell your personal information. We may share your data with:
              </p>
              <ul>
                <li>Service providers who assist in our operations</li>
                <li>Payment processors for transaction processing</li>
                <li>Legal authorities when required by law</li>
              </ul>

              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2>7. Cookies</h2>
              <p>
                We use cookies to enhance your browsing experience. You can control cookie settings through 
                your browser preferences.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
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
