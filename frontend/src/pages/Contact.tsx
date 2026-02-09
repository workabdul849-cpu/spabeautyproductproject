import { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Ground Floor, Marriott Hotel Al Jadaf', 'Dubai, United Arab Emirates'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+971 50 903 9020', '+971 4 123 4567'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@rjbeautylounge.com', 'bookings@rjbeautylounge.com'],
    },
    {
      icon: Clock,
      title: 'Opening Hours',
      details: ['Mon - Sat: 9:00 AM - 9:00 PM', 'Sunday: 10:00 AM - 6:00 PM'],
    },
  ];

  const services = [
    'Hair Services',
    'Facial & Skin Services',
    'Waxing',
    'Hair Treatments',
    'Kids Services',
    'Nail Services',
    'Other',
  ];

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
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-cream-100/80 max-w-2xl mx-auto"
          >
            We'd love to hear from you. Get in touch with us.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-card text-center">
                  <div className="w-14 h-14 bg-brown-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-6 w-6 text-cream-100" />
                  </div>
                  <h3 className="font-serif text-lg text-brown-800 mb-2">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-brown-600 text-sm">{detail}</p>
                  ))}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <ScrollReveal>
              <div className="bg-cream-100 rounded-3xl p-8 lg:p-12">
                <h2 className="font-serif text-2xl text-brown-800 mb-2">Send us a Message</h2>
                <p className="text-brown-600 mb-8">Fill out the form below and we'll get back to you soon.</p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-serif text-xl text-brown-800 mb-2">Message Sent!</h3>
                    <p className="text-brown-600">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-brown-600 mb-2">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:border-brown-400"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-brown-600 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:border-brown-400"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-brown-600 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:border-brown-400"
                          placeholder="+971 50 123 4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-brown-600 mb-2">Service Interest</label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:border-brown-400"
                        >
                          <option value="">Select a service</option>
                          {services.map((service) => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-brown-600 mb-2">Your Message</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:border-brown-400 resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full py-6"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Map */}
            <ScrollReveal delay={0.2}>
              <div className="h-full min-h-[400px] bg-cream-100 rounded-3xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.8678!2d55.2345!3d25.2156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDEyJzU2LjIiTiA1NcKwMTQnMDQuMiJF!5e0!3m2!1sen!2sae!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '500px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="R&J Beauty Lounge Location"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Book Appointment CTA */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-brown-600">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl lg:text-4xl text-cream-100 mb-6">
              Ready to Book Your Appointment?
            </h2>
            <p className="text-cream-100/80 mb-8 max-w-2xl mx-auto">
              Experience the best in beauty and wellness. Our expert team is ready to take care of you.
            </p>
            <a
              href="tel:+971509039020"
              className="inline-flex items-center px-8 py-4 bg-cream-100 text-brown-800 rounded-full hover:bg-white transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call to Book: +971 50 903 9020
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
