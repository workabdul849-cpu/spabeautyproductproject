import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { apiGet } from '../lib/api';
import { formatUSD } from '../lib/money';

type Product = {
  id: number;
  name: string;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
};

function safeImg(url?: string | null) {
  return url && url.trim().length > 0 ? url : '/images/product-gel.jpg';
}

export default function ProductGrid() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Product[]>('/products')
      .then((rows) => setProducts((rows || []).slice(0, 6)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center text-brown-600 py-10">
        Loading products…
      </div>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <ScrollReveal>
            <div>
              <h2 className="font-serif text-3xl text-brown-800 mb-2">Featured Products</h2>
              <p className="text-brown-600">Top picks from our store (USD)</p>
            </div>
          </ScrollReveal>
          <Link to="/store" className="hidden sm:flex items-center text-brown-600 hover:text-brown-800 transition-colors">
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => {
            const original = product.original_price ?? undefined;
            const discount =
              original && original > product.price
                ? Math.round(((original - product.price) / original) * 100)
                : null;

            return (
              <ScrollReveal key={product.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <Link to={`/store/${product.id}`} className="block relative overflow-hidden">
                    <img
                      src={safeImg(product.image_url)}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {discount ? (
                      <div className="absolute top-4 left-4 bg-brown-600 text-white px-3 py-1 rounded-full text-sm">
                        {discount}% OFF
                      </div>
                    ) : null}
                  </Link>

                  <div className="p-6">
                    <Link to={`/store/${product.id}`}>
                      <h3 className="font-serif text-xl text-brown-800 mb-2 group-hover:text-brown-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-brown-800 font-semibold text-lg">
                            {formatUSD(product.price)}
                          </span>
                          {original && original > product.price ? (
                            <span className="text-brown-400 line-through text-sm">
                              {formatUSD(original)}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price, // UI only; server recalculates totals
                            originalPrice: original || undefined,
                            image: safeImg(product.image_url),
                          })
                        }
                        className="p-3 bg-brown-600 text-white rounded-full hover:bg-brown-700 transition-colors"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="text-center mt-12 sm:hidden">
          <Link to="/store" className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors">
            View All Products
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
