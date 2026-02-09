import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { ChevronDown, Search } from 'lucide-react';

const faqCategories = [
  {
    name: 'Booking & Appointments',
    faqs: [
      {
        q: 'How do I book an appointment?',
        a: 'You can book an appointment online through our website by clicking "Book Now" and selecting your preferred service, staff, date, and time. Alternatively, you can call us at +971 50 903 9020 or send us a WhatsApp message.'
      },
      {
        q: 'Can I reschedule or cancel my appointment?',
        a: 'Yes, you can reschedule or cancel your appointment up to 24 hours before your scheduled time without any penalty. Cancellations within 24 hours may be subject to a fee. You can manage your bookings through your profile page.'
      },
      {
        q: 'What if I\'m running late?',
        a: 'Please call us as soon as possible if you\'re running late. We offer a 15-minute grace period, after which we may need to reschedule your appointment or shorten the service time.'
      },
      {
        q: 'Do I need to make a deposit?',
        a: 'For certain premium services and packages, we require a 20% deposit to secure your booking. This can be paid online through our secure payment system.'
      },
    ]
  },
  {
    name: 'Services & Treatments',
    faqs: [
      {
        q: 'What services do you offer?',
        a: 'We offer a comprehensive range of beauty services including hair services (cuts, styling, coloring, treatments), facial and skin services, waxing, nail services, spa treatments, and aesthetic treatments like PRP, microneedling, and HydraFacial.'
      },
      {
        q: 'How long do treatments typically take?',
        a: 'Treatment times vary by service. Haircuts take 45-60 minutes, facials 60-90 minutes, and spa treatments can range from 30 minutes to 2 hours. Specific durations are listed on each service page.'
      },
      {
        q: 'Are your products safe for sensitive skin?',
        a: 'Yes, we use premium, dermatologically-tested products suitable for all skin types. During your consultation, please inform us of any allergies or sensitivities so we can customize the treatment accordingly.'
      },
      {
        q: 'Do you offer services for men?',
        a: 'Absolutely! We offer a full range of grooming services for men including haircuts, beard grooming, facials, and massages. Check our Hair Services and Spa sections for men\'s specific treatments.'
      },
    ]
  },
  {
    name: 'Pricing & Payment',
    faqs: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept cash, credit/debit cards, Apple Pay, Google Pay, and Tabby/Tamara for installment payments. Online payments are processed securely through Stripe.'
      },
      {
        q: 'Do you offer any discounts or promotions?',
        a: 'Yes! We offer seasonal promotions, loyalty program discounts, and referral rewards. Sign up for our newsletter and follow us on social media to stay updated on current offers.'
      },
      {
        q: 'Is VAT included in your prices?',
        a: 'All our prices are inclusive of UAE VAT (5%). You will receive a VAT-compliant invoice for all services and products.'
      },
      {
        q: 'Can I purchase gift cards?',
        a: 'Yes, gift cards are available for purchase online or at our lounge. They can be loaded with any amount and make the perfect gift for any occasion.'
      },
    ]
  },
  {
    name: 'Online Store',
    faqs: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 14 days of purchase for unopened and unused products. Sale items are final sale. Please contact us to initiate a return.'
      },
      {
        q: 'How long does delivery take?',
        a: 'Delivery within Dubai takes 1-2 business days. Other Emirates may take 2-4 business days. We also offer same-day delivery for orders placed before 12 PM within Dubai.'
      },
      {
        q: 'Is there free delivery?',
        a: 'Yes, we offer free delivery on orders over USD 500 within the UAE. Orders below this amount have a flat delivery fee of USD 30.'
      },
    ]
  },
  {
    name: 'Loyalty Program',
    faqs: [
      {
        q: 'How does the loyalty program work?',
        a: 'Earn 1 point for every USD 10 spent on services and products. Points can be redeemed for discounts, free services, and exclusive offers. You also get 100 bonus points when you sign up!'
      },
      {
        q: 'Do points expire?',
        a: 'Loyalty points are valid for 12 months from the date they were earned. We\'ll send you reminders before your points expire.'
      },
      {
        q: 'How do I refer a friend?',
        a: 'Share your unique referral code from your profile. When your friend makes their first booking, you\'ll both earn 100 bonus points!'
      },
    ]
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const allFaqs = faqCategories.flatMap(cat => cat.faqs.map(faq => ({ ...faq, category: cat.name })));
  
  const filteredFaqs = searchQuery
    ? allFaqs.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brown-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl lg:text-6xl text-cream-100 mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <p className="text-xl text-cream-100/80 max-w-2xl mx-auto">
            Find answers to common questions about our services
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-cream-100">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brown-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-cream-200 bg-white focus:outline-none focus:border-brown-400"
            />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {filteredFaqs ? (
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-brown-800 mb-6">Search Results</h2>
              {filteredFaqs.length === 0 ? (
                <p className="text-brown-600 text-center py-8">No results found. Try a different search term.</p>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    faq={faq}
                    isOpen={openIndex === `search-${index}`}
                    onToggle={() => setOpenIndex(openIndex === `search-${index}` ? null : `search-${index}`)}
                  />
                ))
              )}
            </div>
          ) : (
            faqCategories.map((category) => (
              <ScrollReveal key={category.name}>
                <div className="mb-8">
                  <h2 className="font-serif text-xl text-brown-800 mb-4">{category.name}</h2>
                  <div className="space-y-4">
                    {category.faqs.map((faq, index) => (
                      <FAQItem
                        key={index}
                        faq={faq}
                        isOpen={openIndex === `${category.name}-${index}`}
                        onToggle={() => setOpenIndex(openIndex === `${category.name}-${index}` ? null : `${category.name}-${index}`)}
                      />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-cream-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl text-brown-800 mb-4">Still have questions?</h2>
          <p className="text-brown-600 mb-6">Our team is here to help. Reach out to us anytime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/971509039020"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              WhatsApp Us
            </a>
            <a
              href="mailto:info@rjbeautylounge.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-brown-600 text-white rounded-full hover:bg-brown-700"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ faq, isOpen, onToggle }: { faq: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-medium text-brown-800 pr-4">{faq.q}</span>
        <ChevronDown className={`h-5 w-5 text-brown-600 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-brown-600">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
