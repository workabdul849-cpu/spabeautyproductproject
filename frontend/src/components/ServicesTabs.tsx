import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    id: 'hair-services',
    title: 'Hair services',
    description: 'Precision cuts, blow-dries, and styling designed around your hair\'s texture and movement. Every service focuses on maintaining healthy, easy-to-manage, and naturally beautiful hair.',
    image: '/images/service-hair.jpg',
  },
  {
    id: 'facial-skin',
    title: 'Facial \& skin services',
    description: 'Advanced skincare treatments designed to nourish, brighten, and rejuvenate. Each facial is tailored to your skin type for visible, lasting results.',
    image: '/images/social-3.jpg',
  },
  {
    id: 'waxing',
    title: 'Waxing',
    description: 'Professional waxing services using premium products for smooth, long-lasting results. Gentle on skin, effective on hair.',
    image: '/images/social-7.jpg',
  },
  {
    id: 'hair-treatments',
    title: 'Hair treatments',
    description: 'Deep conditioning and restorative treatments to repair, strengthen, and revitalize your hair from root to tip.',
    image: '/images/social-5.jpg',
  },
  {
    id: 'kids-services',
    title: 'Kids services',
    description: 'Gentle and friendly care designed especially for little ones. Our stylists make every visit fun and comfortable while delivering neat, age-appropriate styles.',
    image: '/images/social-6.jpg',
  },
];

export default function ServicesTabs() {
  const [activeService, setActiveService] = useState(services[0]);

  return (
    <section id="services" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left Side - Service List */}
            <div>
              <span className="text-xs uppercase tracking-widest text-brown-500 mb-6 block">
                Beauty Services
              </span>
              <div className="space-y-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(service)}
                    className={`block text-left w-full transition-all duration-300 ${
                      activeService.id === service.id
                        ? 'text-brown-800'
                        : 'text-brown-500 hover:text-brown-700'
                    }`}
                  >
                    <span className={`font-serif text-2xl lg:text-3xl transition-all duration-300 ${
                      activeService.id === service.id ? 'italic' : ''
                    }`}>
                      {service.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Service Content */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Service Image */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                      src={activeService.image}
                      alt={activeService.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Service Description */}
                  <p className="text-brown-600 leading-relaxed">
                    {activeService.description}
                  </p>

                  {/* View More Link */}
                  <Link
                    to={`/services/${activeService.id}`}
                    className="inline-flex items-center text-brown-800 hover:text-brown-600 transition-colors group"
                  >
                    <span className="relative">
                      View more
                      <span className="absolute -bottom-1 left-0 w-full h-px bg-brown-800 transform origin-left transition-transform duration-300 group-hover:scale-x-100 scale-x-100" />
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Decorative Line Art */}
              <div className="absolute -right-8 top-0 w-32 h-32 opacity-20 hidden lg:block">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <path
                    d="M10 50 Q 30 10, 50 50 T 90 50"
                    stroke="#C9A87C"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    d="M10 60 Q 30 20, 50 60 T 90 60"
                    stroke="#C9A87C"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
