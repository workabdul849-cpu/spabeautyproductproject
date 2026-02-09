import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: '10 Essential Hair Care Tips for Healthy, Shiny Hair',
    excerpt: 'Discover the secrets to maintaining beautiful, healthy hair with these expert-approved tips and tricks.',
    image: '/images/service-hair.jpg',
    category: 'Hair Care',
    date: 'Jan 15, 2026',
    readTime: '5 min read',
    content: `
      <p>Healthy, shiny hair is something we all aspire to have. But with so many products and treatments available, it can be overwhelming to know where to start. In this article, we'll share 10 essential hair care tips that will help you achieve the luscious locks you've always dreamed of.</p>
      
      <h2>1. Choose the Right Shampoo and Conditioner</h2>
      <p>The foundation of good hair care starts with using the right products for your hair type. Whether you have dry, oily, curly, or straight hair, there's a shampoo and conditioner specifically formulated for your needs. Look for sulfate-free options that are gentler on your hair and scalp.</p>
      
      <h2>2. Don't Overwash Your Hair</h2>
      <p>Washing your hair too frequently can strip it of its natural oils, leading to dryness and damage. Aim to wash your hair 2-3 times a week, depending on your hair type and lifestyle. If you have oily hair, you might need to wash more frequently, while dry hair can go longer between washes.</p>
      
      <h2>3. Use Lukewarm Water</h2>
      <p>Hot water can damage your hair and scalp, causing dryness and irritation. Instead, use lukewarm water when washing your hair. Finish with a cool rinse to help seal the hair cuticle and add shine.</p>
      
      <h2>4. Protect Your Hair from Heat</h2>
      <p>Heat styling tools like flat irons, curling wands, and blow dryers can cause significant damage to your hair over time. Always use a heat protectant spray before styling, and try to limit heat styling to special occasions. When you do use heat tools, keep them on the lowest effective temperature setting.</p>
      
      <h2>5. Get Regular Trims</h2>
      <p>Even if you're growing your hair out, regular trims are essential for maintaining healthy hair. Aim to get a trim every 6-8 weeks to remove split ends and prevent further damage from traveling up the hair shaft.</p>
      
      <h2>6. Deep Condition Weekly</h2>
      <p>A weekly deep conditioning treatment can work wonders for your hair. Use a hair mask or deep conditioner once a week to nourish and hydrate your strands. Leave it on for at least 15-20 minutes for maximum benefits.</p>
      
      <h2>7. Be Gentle When Wet</h2>
      <p>Wet hair is more fragile and prone to breakage. Avoid brushing wet hair; instead, use a wide-tooth comb to gently detangle. Start from the ends and work your way up to minimize damage.</p>
      
      <h2>8. Protect Your Hair While Sleeping</h2>
      <p>Cotton pillowcases can cause friction and lead to frizz and breakage. Switch to a silk or satin pillowcase to reduce friction and help your hair retain moisture. You can also wrap your hair in a silk scarf before bed.</p>
      
      <h2>9. Eat a Balanced Diet</h2>
      <p>Healthy hair starts from within. Make sure you're eating a balanced diet rich in protein, vitamins, and minerals. Foods like eggs, nuts, leafy greens, and fatty fish are particularly beneficial for hair health.</p>
      
      <h2>10. Stay Hydrated</h2>
      <p>Drinking enough water is crucial for overall health, including the health of your hair. Aim to drink at least 8 glasses of water a day to keep your hair hydrated from the inside out.</p>
      
      <p>By following these 10 essential hair care tips, you'll be well on your way to achieving healthy, shiny, beautiful hair. Remember, consistency is key – stick to a regular hair care routine and be patient. Your hair will thank you!</p>
    `,
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Skincare Routines',
    excerpt: 'Learn how to build the perfect skincare routine tailored to your skin type and concerns.',
    image: '/images/social-3.jpg',
    category: 'Skincare',
    date: 'Jan 12, 2026',
    readTime: '8 min read',
    content: `
      <p>Creating the perfect skincare routine can seem daunting, but it doesn't have to be. The key is understanding your skin type and choosing products that address your specific concerns. In this comprehensive guide, we'll walk you through building a skincare routine that works for you.</p>
      
      <h2>Understanding Your Skin Type</h2>
      <p>Before you can build an effective skincare routine, you need to know your skin type. The main skin types are:</p>
      <ul>
        <li><strong>Normal:</strong> Balanced, neither too oily nor too dry</li>
        <li><strong>Oily:</strong> Produces excess sebum, prone to shine and breakouts</li>
        <li><strong>Dry:</strong> Lacks moisture, may feel tight or flaky</li>
        <li><strong>Combination:</strong> Oily in some areas (usually T-zone), dry in others</li>
        <li><strong>Sensitive:</strong> Easily irritated, prone to redness and reactions</li>
      </ul>
      
      <h2>The Basic Skincare Routine</h2>
      <p>Every skincare routine should include these fundamental steps:</p>
      
      <h3>1. Cleanser</h3>
      <p>Start and end your day with a gentle cleanser to remove dirt, oil, and impurities. Choose a cleanser suited to your skin type – gel cleansers work well for oily skin, while cream cleansers are better for dry skin.</p>
      
      <h3>2. Toner</h3>
      <p>Toners help balance your skin's pH and prepare it for the next steps in your routine. Look for alcohol-free formulas with hydrating or soothing ingredients.</p>
      
      <h3>3. Serum</h3>
      <p>Serums are concentrated treatments that target specific concerns like aging, dark spots, or hydration. Apply them after toning and before moisturizing.</p>
      
      <h3>4. Moisturizer</h3>
      <p>Everyone needs a moisturizer, regardless of skin type. It helps lock in hydration and protect your skin barrier. Choose a lightweight formula for oily skin and a richer cream for dry skin.</p>
      
      <h3>5. Sunscreen</h3>
      <p>The most important step in any skincare routine is sunscreen. Apply SPF 30 or higher every morning, even on cloudy days or when staying indoors.</p>
      
      <h2>Additional Treatments</h2>
      <p>Depending on your skin concerns, you might want to incorporate additional treatments:</p>
      <ul>
        <li><strong>Exfoliants:</strong> Use 1-2 times a week to remove dead skin cells</li>
        <li><strong>Face Masks:</strong> Apply weekly for an extra boost of hydration or treatment</li>
        <li><strong>Eye Cream:</strong> Target the delicate eye area with specialized products</li>
      </ul>
      
      <p>Remember, building a skincare routine is a journey. Start with the basics and gradually introduce new products, giving your skin time to adjust. With patience and consistency, you'll achieve the healthy, glowing skin you deserve.</p>
    `,
  },
  {
    id: 3,
    title: '2026 Nail Art Trends You Need to Try',
    excerpt: 'From minimalist designs to bold patterns, explore the hottest nail art trends of the year.',
    image: '/images/social-1.jpg',
    category: 'Nail Care',
    date: 'Jan 10, 2026',
    readTime: '4 min read',
    content: `<p>Nail art continues to evolve, and 2026 brings exciting new trends that are taking the beauty world by storm. From subtle elegance to bold statements, there's something for everyone this year.</p>`,
  },
  {
    id: 4,
    title: 'The Benefits of Regular Spa Treatments',
    excerpt: 'Why treating yourself to regular spa visits is more than just pampering—it\'s essential self-care.',
    image: '/images/cta-image-3.jpg',
    category: 'Wellness',
    date: 'Jan 8, 2026',
    readTime: '6 min read',
    content: `<p>In our busy modern lives, taking time for self-care is more important than ever. Regular spa treatments offer numerous benefits that go far beyond simple pampering.</p>`,
  },
  {
    id: 5,
    title: 'Keratin vs. Botox: Which Hair Treatment is Right for You?',
    excerpt: 'A comprehensive comparison of two popular hair treatments to help you make the best choice.',
    image: '/images/social-5.jpg',
    category: 'Hair Care',
    date: 'Jan 5, 2026',
    readTime: '7 min read',
    content: `<p>When it comes to hair smoothing treatments, keratin and hair botox are two of the most popular options. But which one is right for you? Let's break down the differences.</p>`,
  },
  {
    id: 6,
    title: 'Summer Skincare: Protecting Your Skin in the Heat',
    excerpt: 'Essential tips for keeping your skin healthy and protected during the hot summer months.',
    image: '/images/cta-image-2.jpg',
    category: 'Skincare',
    date: 'Jan 3, 2026',
    readTime: '5 min read',
    content: `<p>The summer heat can be harsh on your skin. Learn how to protect and care for your skin during the hottest months of the year.</p>`,
  },
  {
    id: 7,
    title: 'The Art of the Perfect Blowout',
    excerpt: 'Learn professional techniques to achieve salon-quality blowouts at home.',
    image: '/images/social-2.jpg',
    category: 'Hair Care',
    date: 'Dec 28, 2025',
    readTime: '6 min read',
    content: `<p>A professional blowout can transform your hair, giving it volume, shine, and a polished look. Here's how to achieve salon-quality results at home.</p>`,
  },
  {
    id: 8,
    title: 'Mindfulness and Beauty: The Connection',
    excerpt: 'How practicing mindfulness can enhance your natural beauty and overall well-being.',
    image: '/images/social-7.jpg',
    category: 'Wellness',
    date: 'Dec 25, 2025',
    readTime: '5 min read',
    content: `<p>The connection between inner peace and outer beauty is profound. Discover how mindfulness practices can enhance your natural radiance.</p>`,
  },
];

export default function BlogPost() {
  const { postId } = useParams<{ postId: string }>();
  const post = blogPosts.find((p) => p.id === Number(postId));

  if (!post) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <h1 className="font-serif text-3xl text-brown-800 mb-4">Article Not Found</h1>
        <Link to="/blog" className="text-brown-600 hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="pt-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-800/60 to-transparent" />
      </div>

      {/* Content */}
      <article className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <Link to="/blog" className="inline-flex items-center text-brown-600 hover:text-brown-800 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>

            <span className="inline-block bg-cream-100 text-brown-600 text-sm px-4 py-1 rounded-full mb-4">
              {post.category}
            </span>

            <h1 className="font-serif text-3xl lg:text-5xl text-brown-800 mb-6">
              {post.title}
            </h1>

            <div className="flex items-center text-sm text-brown-500 mb-8 pb-8 border-b border-cream-200">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-4">{post.date}</span>
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime}</span>
            </div>

            <div 
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brown-800 prose-p:text-brown-600 prose-li:text-brown-600 prose-strong:text-brown-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-cream-200">
              <p className="text-brown-600 mb-4 flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Share this article
              </p>
              <div className="flex gap-3">
                <button className="p-3 bg-cream-100 rounded-full hover:bg-cream-200 transition-colors">
                  <Facebook className="h-5 w-5 text-brown-600" />
                </button>
                <button className="p-3 bg-cream-100 rounded-full hover:bg-cream-200 transition-colors">
                  <Twitter className="h-5 w-5 text-brown-600" />
                </button>
                <button className="p-3 bg-cream-100 rounded-full hover:bg-cream-200 transition-colors">
                  <Linkedin className="h-5 w-5 text-brown-600" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-cream-100">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-2xl text-brown-800 mb-8">Related Articles</h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <ScrollReveal key={relatedPost.id} delay={index * 0.1}>
                  <Link to={`/blog/${relatedPost.id}`}>
                    <motion.article
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-lg text-brown-800 group-hover:text-brown-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </motion.article>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
