import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "I'm extremely happy with the hair treatment. My hair feels softer, healthier, and much more manageable after just one visit. The specialist carefully assessed my hair and chose the right treatment for me. You can really feel the quality and expertise here.",
    name: 'NOOR ALIA',
    avatar: '/images/testimonial-avatar-1.jpg',
  },
  {
    id: 2,
    quote: "The massage was absolutely amazing. The therapist was very professional and knew exactly how to release the tension. I left feeling deeply relaxed and refreshed. The atmosphere is calm and luxurious — I will definitely come back.",
    name: 'LAYLA HASSAN',
    avatar: '/images/testimonial-avatar-2.jpg',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="relative">
            {/* Quote Icon */}
            <div className="flex justify-center mb-8">
              <Quote className="h-10 w-10 text-gold-400" />
            </div>

            {/* Testimonial Content */}
            <div className="relative min-h-[300px] flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-center"
                >
                  {/* Avatar */}
                  <div className="mb-8">
                    <img
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-cream-100"
                    />
                  </div>

                  {/* Quote */}
                  <p className="font-serif text-xl lg:text-2xl text-brown-800 italic leading-relaxed mb-8 max-w-2xl mx-auto">
                    "{testimonials[currentIndex].quote}"
                  </p>

                  {/* Name */}
                  <p className="text-sm text-brown-500 tracking-widest">
                    {testimonials[currentIndex].name}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-brown-300 text-brown-600 hover:bg-brown-600 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-brown-600' : 'bg-brown-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-brown-300 text-brown-600 hover:bg-brown-600 hover:text-white transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
