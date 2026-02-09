import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';

const categories = ['All', 'Hair Care', 'Skincare', 'Nail Care', 'Wellness', 'Trends'];

const blogPosts = [
  {
    id: 1,
    title: '10 Essential Hair Care Tips for Healthy, Shiny Hair',
    excerpt: 'Discover the secrets to maintaining beautiful, healthy hair with these expert-approved tips and tricks.',
    image: '/images/service-hair.jpg',
    category: 'Hair Care',
    date: 'Jan 15, 2026',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Skincare Routines',
    excerpt: 'Learn how to build the perfect skincare routine tailored to your skin type and concerns.',
    image: '/images/social-3.jpg',
    category: 'Skincare',
    date: 'Jan 12, 2026',
    readTime: '8 min read',
    featured: false,
  },
  {
    id: 3,
    title: '2026 Nail Art Trends You Need to Try',
    excerpt: 'From minimalist designs to bold patterns, explore the hottest nail art trends of the year.',
    image: '/images/social-1.jpg',
    category: 'Nail Care',
    date: 'Jan 10, 2026',
    readTime: '4 min read',
    featured: false,
  },
  {
    id: 4,
    title: 'The Benefits of Regular Spa Treatments',
    excerpt: 'Why treating yourself to regular spa visits is more than just pampering—it\'s essential self-care.',
    image: '/images/cta-image-3.jpg',
    category: 'Wellness',
    date: 'Jan 8, 2026',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 5,
    title: 'Keratin vs. Botox: Which Hair Treatment is Right for You?',
    excerpt: 'A comprehensive comparison of two popular hair treatments to help you make the best choice.',
    image: '/images/social-5.jpg',
    category: 'Hair Care',
    date: 'Jan 5, 2026',
    readTime: '7 min read',
    featured: false,
  },
  {
    id: 6,
    title: 'Summer Skincare: Protecting Your Skin in the Heat',
    excerpt: 'Essential tips for keeping your skin healthy and protected during the hot summer months.',
    image: '/images/cta-image-2.jpg',
    category: 'Skincare',
    date: 'Jan 3, 2026',
    readTime: '5 min read',
    featured: false,
  },
  {
    id: 7,
    title: 'The Art of the Perfect Blowout',
    excerpt: 'Learn professional techniques to achieve salon-quality blowouts at home.',
    image: '/images/social-2.jpg',
    category: 'Hair Care',
    date: 'Dec 28, 2025',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 8,
    title: 'Mindfulness and Beauty: The Connection',
    excerpt: 'How practicing mindfulness can enhance your natural beauty and overall well-being.',
    image: '/images/social-7.jpg',
    category: 'Wellness',
    date: 'Dec 25, 2025',
    readTime: '5 min read',
    featured: false,
  },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured || selectedCategory !== 'All');

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brown-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl lg:text-6xl text-cream-100 mb-6"
          >
            Blog & Resources
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-cream-100/80 max-w-2xl mx-auto"
          >
            Beauty tips, trends, and expert advice
          </motion.p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-cream-200 sticky top-20 bg-cream-50/95 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-brown-600 text-white'
                      : 'bg-cream-100 text-brown-800 hover:bg-cream-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brown-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-cream-200 bg-white focus:outline-none focus:border-brown-400 w-full lg:w-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === 'All' && !searchQuery && (
        <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <Link to={`/blog/${featuredPost.id}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="group grid lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover"
                >
                  <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="inline-block bg-gold-400 text-white text-xs px-3 py-1 rounded-full w-fit mb-4">
                      Featured
                    </span>
                    <span className="text-sm text-brown-500 mb-2">{featuredPost.category}</span>
                    <h2 className="font-serif text-2xl lg:text-3xl text-brown-800 mb-4 group-hover:text-brown-600 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-brown-600 mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center text-sm text-brown-500 mb-6">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{featuredPost.date}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <div className="flex items-center text-brown-800 font-medium group-hover:text-brown-600 transition-colors">
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-brown-600 text-lg">No articles found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <ScrollReveal key={post.id} delay={index * 0.1}>
                  <Link to={`/blog/${post.id}`}>
                    <motion.article
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-sm text-brown-500">{post.category}</span>
                        <h3 className="font-serif text-xl text-brown-800 mt-2 mb-3 group-hover:text-brown-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-brown-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center text-sm text-brown-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-4">{post.date}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
