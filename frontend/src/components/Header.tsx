import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { name: 'About', href: '/about' },
  { 
    name: 'Services', 
    href: '/services',
    dropdown: [
      { name: 'Hair services', href: '/services/hair-services' },
      { name: 'Facial & skin services', href: '/services/facial-skin' },
      { name: 'Waxing', href: '/services/waxing' },
      { name: 'Hair treatments', href: '/services/hair-treatments' },
      { name: 'Kids services', href: '/services/kids-services' },
    ]
  },
  { name: 'Online Store', href: '/store' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <svg 
              viewBox="0 0 140 40" 
              className="h-10 w-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="0"
                y="28"
                className="font-serif italic"
                style={{ fontSize: '28px', fill: '#C9A87C' }}
              >
                R&J
              </text>
              <text
                x="50"
                y="28"
                className="font-sans"
                style={{ fontSize: '12px', fill: '#5C4A32', letterSpacing: '0.05em' }}
              >
                Beauty Lounge
              </text>
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.dropdown ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button className={`flex items-center text-sm transition-colors ${
                      isActive(link.href) ? 'text-brown-800 font-medium' : 'text-brown-600 hover:text-brown-800'
                    }`}>
                      {link.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg py-2 z-50"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="block px-4 py-2 text-sm text-brown-800 hover:bg-cream-100 transition-colors"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className={`relative text-sm transition-colors group ${
                      isActive(link.href) ? 'text-brown-800 font-medium' : 'text-brown-600 hover:text-brown-800'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold-400 transition-all duration-300 ${
                      isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Icon */}
            {isAuthenticated ? (
              <Link to="/profile" className="p-2 text-brown-800 hover:text-brown-600 transition-colors">
                <div className="w-8 h-8 bg-brown-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName[0]}{user?.lastName[0]}
                  </span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="p-2 text-brown-800 hover:text-brown-600 transition-colors">
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Cart Icon */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-brown-800 hover:text-brown-600 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-brown-600 text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Book Appointment Button - Desktop */}
            <Link to="/book">
              <Button 
                className="hidden md:inline-flex bg-brown-600 hover:bg-brown-700 text-white rounded-full px-6"
              >
                Book Now
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 text-brown-800">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-cream-50">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <span className="font-serif text-xl text-gold-400">Menu</span>
                  </div>
                  <nav className="flex flex-col space-y-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-lg transition-colors ${
                          isActive(link.href) ? 'text-brown-800 font-medium' : 'text-brown-600 hover:text-brown-800'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                    {isAuthenticated && (
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg text-brown-600 hover:text-brown-800"
                      >
                        My Profile
                      </Link>
                    )}
                  </nav>
                  <div className="mt-auto pb-8 space-y-3">
                    <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full"
                      >
                        Book Now
                      </Button>
                    </Link>
                    {!isAuthenticated && (
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="outline"
                          className="w-full rounded-full border-brown-600 text-brown-800"
                        >
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
