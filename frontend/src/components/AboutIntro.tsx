import ScrollReveal from './ScrollReveal';

export default function AboutIntro() {
  return (
    <section id="about" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-lg sm:text-xl lg:text-2xl text-brown-800 leading-relaxed font-light">
            At Romeo & Juliet Beauty Lounge, every detail is designed to create an experience that celebrates you. Our certified professionals combine skills with science, offering a full range of beauty and wellness services. Located in Marriott Al Jaddaf, Dubai, our lounge is DHA-regulated, ensuring the highest standards of safety, hygiene, and professional excellence. We're here to help you look and feel your absolute best.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
