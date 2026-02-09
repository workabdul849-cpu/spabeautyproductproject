import { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

const categories = ['All', 'Hair', 'Facial', 'Nail', 'Spa', 'Aesthetic'];

const galleryItems = [
  { id: 1, category: 'Hair', type: 'before-after', before: '/images/social-5.jpg', after: '/images/service-hair.jpg', title: 'Keratin Treatment' },
  { id: 2, category: 'Facial', type: 'before-after', before: '/images/social-3.jpg', after: '/images/cta-image-2.jpg', title: 'Deep Cleansing Facial' },
  { id: 3, category: 'Nail', type: 'single', image: '/images/social-1.jpg', title: 'Gel Manicure' },
  { id: 4, category: 'Spa', type: 'single', image: '/images/cta-image-3.jpg', title: 'Relaxing Massage' },
  { id: 5, category: 'Hair', type: 'single', image: '/images/social-2.jpg', title: 'Blowout Styling' },
  { id: 6, category: 'Aesthetic', type: 'before-after', before: '/images/testimonial-avatar-1.jpg', after: '/images/testimonial-avatar-2.jpg', title: 'Skin Rejuvenation' },
  { id: 7, category: 'Nail', type: 'single', image: '/images/product-nail.jpg', title: 'Nail Art Design' },
  { id: 8, category: 'Hair', type: 'single', image: '/images/cta-image-1.jpg', title: 'Hair Wash & Treatment' },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = selectedCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

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
            Our Gallery
          </motion.h1>
          <p className="text-xl text-cream-100/80 max-w-2xl mx-auto">
            See the transformations and beautiful work our experts create
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-cream-200 sticky top-20 bg-cream-50/95 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brown-600 text-white'
                    : 'bg-cream-100 text-brown-800 hover:bg-cream-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer group"
                >
                  {item.type === 'before-after' ? (
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <div className="grid grid-cols-2 h-full">
                        <div className="relative">
                          <img src={item.before} alt="Before" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Before</span>
                        </div>
                        <div className="relative">
                          <img src={item.after} alt="After" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">After</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-white/70 text-sm">{item.category}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-4xl"
            onClick={() => setSelectedItem(null)}
          >
            ×
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            {selectedItem.type === 'before-after' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white text-center mb-2">Before</p>
                  <img src={selectedItem.before} alt="Before" className="w-full rounded-xl" />
                </div>
                <div>
                  <p className="text-white text-center mb-2">After</p>
                  <img src={selectedItem.after} alt="After" className="w-full rounded-xl" />
                </div>
              </div>
            ) : (
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full rounded-xl" />
            )}
            <p className="text-white text-center mt-4 text-xl">{selectedItem.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
