import { Link } from 'react-router-dom';
import { MapPin, Instagram, Facebook } from 'lucide-react';

const footerLinks = {
  navigation: [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Online Store', href: '/store' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Returns & Refunds', href: '/returns' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brown-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <p className="font-serif text-gold-400 text-lg mb-2">Where Beauty Awaits</p>
            <h3 className="font-serif text-2xl text-cream-100 mb-4">R&J Beauty Lounge</h3>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start text-cream-100/70 hover:text-cream-100 transition-colors text-sm"
            >
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Ground Floor, Marriott Hotel Al Jadaf, Dubai, United Arab Emirates</span>
            </a>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-cream-100/10 rounded-full flex items-center justify-center text-cream-100 hover:bg-cream-100/20 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-cream-100/10 rounded-full flex items-center justify-center text-cream-100 hover:bg-cream-100/20 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-cream-100/10 rounded-full flex items-center justify-center text-cream-100 hover:bg-cream-100/20 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-cream-100 font-medium mb-4">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-cream-100/70 hover:text-cream-100 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-cream-100 font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-cream-100/70 hover:text-cream-100 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-cream-100 font-medium mb-4">Contact</h4>
            <ul className="space-y-3 text-cream-100/70 text-sm">
              <li>
                <a href="tel:+971509039020" className="hover:text-cream-100 transition-colors">
                  +971 50 903 9020
                </a>
              </li>
              <li>
                <a href="mailto:info@rjbeautylounge.com" className="hover:text-cream-100 transition-colors">
                  info@rjbeautylounge.com
                </a>
              </li>
              <li className="pt-2">
                <p>Mon - Sat: 9:00 AM - 9:00 PM</p>
                <p>Sunday: 10:00 AM - 6:00 PM</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cream-100/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream-100/50 text-sm">
            © 2026 R&J All Rights Reserved
          </p>
          <p className="text-cream-100/50 text-sm">
            Website design and development by{' '}
            <a
              href="https://hogi.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream-100/70 hover:text-cream-100 transition-colors font-medium"
            >
              hogi.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
