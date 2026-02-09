import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { Button } from '@/components/ui/button';
import { Phone, Mail } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section id="contact" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-brown-800">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Text */}
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl text-cream-100 leading-tight mb-6">
                We'd love to hear from you. Let's make your next beauty visit effortless.
              </h2>
              <p className="text-cream-100/70 leading-relaxed">
                Contact our team for bookings, consultations, or any inquiries; we're here to help you find the right service for your needs.
              </p>
            </div>

            {/* Right Side - Contact Info */}
            <div className="flex flex-col items-start lg:items-end space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                <a
                  href="tel:+971509039020"
                  className="flex items-center text-cream-100 hover:text-gold-400 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  <span>+971 50 903 9020</span>
                </a>
                <a
                  href="mailto:info@rjbeautylounge.com"
                  className="flex items-center text-cream-100 hover:text-gold-400 transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  <span>info@rjbeautylounge.com</span>
                </a>
              </div>
              <Link to="/contact">
                <Button 
                  variant="outline"
                  className="border-cream-100 text-cream-100 hover:bg-cream-100 hover:text-brown-800 rounded-full px-8"
                >
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
