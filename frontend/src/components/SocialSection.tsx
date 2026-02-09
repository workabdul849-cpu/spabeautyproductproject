import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const socialImages = [
  { src: '/images/social-1.jpg', alt: 'Manicure service' },
  { src: '/images/social-2.jpg', alt: 'Hair styling' },
  { src: '/images/social-3.jpg', alt: 'Facial treatment' },
  { src: '/images/social-4.jpg', alt: 'Salon experience' },
  { src: '/images/social-5.jpg', alt: 'Hair coloring' },
  { src: '/images/social-6.jpg', alt: 'Kids haircut' },
  { src: '/images/social-7.jpg', alt: 'Waxing service' },
];

const socialLinks = [
  { name: 'Instagram', href: '#' },
  { name: 'Facebook', href: '#' },
  { name: 'TikTok', href: '#' },
];

export default function SocialSection() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-cream-100">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            <span className="text-xs uppercase tracking-widest text-brown-500 mb-4 lg:mb-0">
              Follow Us
            </span>
            <div className="flex flex-wrap gap-6 lg:gap-12">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-serif text-2xl lg:text-3xl text-brown-800 hover:text-gold-400 transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {socialImages.map((image, index) => (
            <ScrollReveal key={index} delay={index * 0.05}>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="block aspect-square rounded-xl overflow-hidden"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </motion.a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
