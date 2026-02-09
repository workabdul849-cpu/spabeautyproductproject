import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { Button } from '@/components/ui/button';

const images = [
  { src: '/images/cta-image-1.jpg', alt: 'Hair washing service' },
  { src: '/images/cta-image-2.jpg', alt: 'Beautiful hair styling' },
  { src: '/images/cta-image-3.jpg', alt: 'Spa massage treatment' },
];

export default function CTABanner() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl text-brown-800 max-w-lg">
              Come to a space built around comfort, care, and confidence
            </h2>
            <Link to="/contact" className="mt-6 lg:mt-0">
              <Button 
                className="bg-brown-600 hover:bg-brown-700 text-white rounded-full px-8"
              >
                Book your visit today
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          {images.map((image, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden aspect-[3/4]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
