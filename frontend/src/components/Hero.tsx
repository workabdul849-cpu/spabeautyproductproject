import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToContent = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} className="relative min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          style={{ y, opacity }}
          className="relative h-[calc(100vh-120px)] min-h-[500px] rounded-3xl overflow-hidden"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brown-800/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-8 sm:px-16 lg:px-24">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white max-w-3xl leading-tight"
            >
              Experts in Elevating Beauty Experiences.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-8"
            >
              <Link to="/contact">
                <Button 
                  className="bg-brown-600/90 hover:bg-brown-700 text-white rounded-full px-8 py-6 text-sm backdrop-blur-sm"
                >
                  Book Appointment
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.button
            onClick={scrollToContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-cream-50/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-cream-50 transition-colors"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-5 w-5 text-brown-600" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
