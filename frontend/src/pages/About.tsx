import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { Award, Users, Sparkles, Shield } from 'lucide-react';

const stats = [
  { number: '10+', label: 'Years Experience' },
  { number: '50+', label: 'Expert Staff' },
  { number: '10K+', label: 'Happy Clients' },
  { number: '25+', label: 'Beauty Awards' },
];

const values = [
  {
    icon: Sparkles,
    title: 'Excellence',
    description: 'We strive for perfection in every service we provide, ensuring you leave feeling your absolute best.',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'DHA-regulated with the highest standards of hygiene and safety protocols for your peace of mind.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our certified professionals are carefully selected and continuously trained in the latest techniques.',
  },
  {
    icon: Award,
    title: 'Quality Products',
    description: 'We use only premium, dermatologically-tested products for all our treatments and services.',
  },
];

const team = [
  {
    name: 'Sarah Mitchell',
    role: 'Creative Director',
    image: '/images/cta-image-2.jpg',
  },
  {
    name: 'Aisha Rahman',
    role: 'Senior Stylist',
    image: '/images/testimonial-avatar-1.jpg',
  },
  {
    name: 'Emma Wilson',
    role: 'Spa Manager',
    image: '/images/testimonial-avatar-2.jpg',
  },
  {
    name: 'Maria Santos',
    role: 'Color Specialist',
    image: '/images/social-4.jpg',
  },
];

export default function About() {
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
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-cream-100/80 max-w-2xl mx-auto"
          >
            Where passion meets expertise in the art of beauty
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal>
              <div className="relative">
                <img
                  src="/images/service-hair.jpg"
                  alt="Our salon"
                  className="rounded-3xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-brown-600 text-cream-100 p-6 rounded-2xl hidden lg:block">
                  <p className="font-serif text-3xl">Since 2014</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h2 className="font-serif text-3xl lg:text-4xl text-brown-800 mb-6">
                A Legacy of Beauty Excellence
              </h2>
              <div className="space-y-4 text-brown-600 leading-relaxed">
                <p>
                  Founded in 2014, Romeo & Juliet Beauty Lounge began with a simple vision: to create a sanctuary where beauty meets wellness. What started as a small salon has grown into one of Dubai's most trusted beauty destinations.
                </p>
                <p>
                  Located in the prestigious Marriott Al Jaddaf, our lounge is DHA-regulated, ensuring the highest standards of safety, hygiene, and professional excellence. Every detail of our space is designed to create an experience that celebrates you.
                </p>
                <p>
                  Our team of certified professionals combines artistic skill with scientific knowledge, offering a full range of beauty and wellness services tailored to your unique needs.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cream-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="text-center">
                  <p className="font-serif text-4xl lg:text-5xl text-brown-800 mb-2">
                    {stat.number}
                  </p>
                  <p className="text-brown-500 text-sm uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl lg:text-4xl text-brown-800 mb-4">
                Our Values
              </h2>
              <p className="text-brown-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-brown-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-cream-100" />
                  </div>
                  <h3 className="font-serif text-xl text-brown-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-brown-600 text-sm">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-cream-100">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl lg:text-4xl text-brown-800 mb-4">
                Meet Our Team
              </h2>
              <p className="text-brown-600 max-w-2xl mx-auto">
                Expert professionals dedicated to making you look and feel your best
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="group">
                  <div className="relative overflow-hidden rounded-2xl mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-xl text-brown-800">{member.name}</h3>
                  <p className="text-brown-500 text-sm">{member.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
