import Hero from '../components/Hero';
import AboutIntro from '../components/AboutIntro';
import PoweredBy from '../components/PoweredBy';
import ServicesTabs from '../components/ServicesTabs';
import ProductGrid from '../components/ProductGrid';
import CTABanner from '../components/CTABanner';
import Testimonials from '../components/Testimonials';
import SocialSection from '../components/SocialSection';
import ContactCTA from '../components/ContactCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <PoweredBy />
      <ServicesTabs />
      <ProductGrid />
      <CTABanner />
      <Testimonials />
      <SocialSection />
      <ContactCTA />
    </>
  );
}
