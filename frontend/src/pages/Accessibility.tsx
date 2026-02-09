import ScrollReveal from '../components/ScrollReveal';

export default function Accessibility() {
  return (
    <div className="pt-20">
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brown-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl lg:text-6xl text-cream-100 mb-6">
            Accessibility Statement
          </h1>
        </div>
      </section>

      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brown-800 prose-p:text-brown-600">
              <p className="text-sm text-brown-500 mb-8">Last updated: February 8, 2026</p>

              <h2>Our Commitment</h2>
              <p>
                R&J Beauty Lounge is committed to ensuring digital accessibility for people with disabilities. 
                We are continually improving the user experience for everyone and applying the relevant 
                accessibility standards.
              </p>

              <h2>Accessibility Features</h2>
              <p>Our website includes the following accessibility features:</p>
              <ul>
                <li><strong>Keyboard Navigation:</strong> All functionality is accessible via keyboard</li>
                <li><strong>Screen Reader Support:</strong> Compatible with popular screen readers</li>
                <li><strong>Alt Text:</strong> Images include descriptive alternative text</li>
                <li><strong>Color Contrast:</strong> Text meets WCAG AA contrast requirements</li>
                <li><strong>Resizable Text:</strong> Content remains accessible when zoomed up to 200%</li>
                <li><strong>Focus Indicators:</strong> Clear visual focus states for interactive elements</li>
                <li><strong>Form Labels:</strong> All form fields have associated labels</li>
                <li><strong>Skip Links:</strong> Quick navigation to main content</li>
              </ul>

              <h2>Conformance Status</h2>
              <p>
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. 
                These guidelines explain how to make web content more accessible for people with 
                disabilities and more user-friendly for everyone.
              </p>

              <h2>Physical Accessibility</h2>
              <p>Our lounge is designed to be accessible to all clients:</p>
              <ul>
                <li>Wheelchair accessible entrance and facilities</li>
                <li>Accessible parking spaces available</li>
                <li>Wide doorways and corridors</li>
                <li>Accessible restrooms</li>
                <li>Service animals welcome</li>
              </ul>

              <h2>Feedback</h2>
              <p>
                We welcome your feedback on the accessibility of our website and lounge. 
                Please let us know if you encounter any barriers:
              </p>
              <ul>
                <li>Email: info@rjbeautylounge.com</li>
                <li>Phone: +971 50 903 9020</li>
                <li>Visit us: Ground Floor, Marriott Hotel Al Jadaf, Dubai</li>
              </ul>

              <h2>Continuous Improvement</h2>
              <p>
                We are committed to ongoing accessibility improvements. We regularly review our 
                website and services to identify and address accessibility issues. Your feedback 
                helps us serve you better.
              </p>

              <h2>Third-Party Content</h2>
              <p>
                Some content on our website may be provided by third parties (such as embedded 
                videos or social media feeds). While we strive to ensure accessibility, we cannot 
                guarantee the accessibility of third-party content.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
