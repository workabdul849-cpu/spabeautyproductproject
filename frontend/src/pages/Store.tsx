import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Filter, Search, Star } from 'lucide-react';
import { apiGet } from '../lib/api';
import { formatUSD } from '../lib/money';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price?: number | null;
  stock: number;
  description?: string | null;
  image_url?: string | null;
  rating?: number | null;
  reviews?: number | null;
};

function safeImg(url?: string | null) {
  return url && url.trim().length > 0 ? url : '/images/product-gel.jpg';
}

export default function Store() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    apiGet<Product[]>('/products')
      .then((rows) => setProducts(rows || []))
      .catch((e) => setError(e?.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.category) set.add(p.category);
    }
    return ['All', ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const catOk = selectedCategory === 'All' || p.category === selectedCategory;
      const qOk =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="font-serif text-4xl lg:text-5xl text-brown-800 mb-4">
              Shop Our Products
            </h1>
            <p className="text-brown-600 max-w-2xl mx-auto text-lg">
              Premium beauty essentials — prices shown in USD.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Controls */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cream-200 bg-white sticky top-16 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brown-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-cream-200 focus:outline-none focus:border-brown-400 bg-cream-50"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-6 py-3 rounded-full border border-cream-200 text-brown-600 hover:text-brown-800 hover:border-brown-300 transition-colors bg-white"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-cream-50 rounded-2xl">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-brown-600 text-white'
                        : 'bg-white text-brown-600 hover:bg-cream-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading && <p className="text-center text-brown-600">Loading products…</p>}
          {!loading && error && (
            <p className="text-center text-red-600">{error}</p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-brown-600">No products found.</p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filtered.map((product, index) => {
              const original = product.original_price ?? undefined;
              const discount =
                original && original > product.price
                  ? Math.round(((original - product.price) / original) * 100)
                  : null;

              return (
                <ScrollReveal key={product.id} delay={index * 0.05}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
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
                      {product.stock <= 0 ? (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                          Out of stock
                        </div>
                      ) : null}
                    </Link>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-brown-500 text-sm">{product.category}</p>
                          <Link to={`/store/${product.id}`}>
                            <h3 className="font-serif text-xl text-brown-800 group-hover:text-brown-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                        </div>
                        {product.rating ? (
                          <div className="flex items-center text-sm text-brown-600">
                            <Star className="h-4 w-4 fill-current mr-1" />
                            {Number(product.rating).toFixed(1)}
                          </div>
                        ) : null}
                      </div>

                      {product.description ? (
                        <p className="text-brown-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      ) : null}

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
                          {product.reviews ? (
                            <p className="text-brown-500 text-xs">
                              {product.reviews} reviews
                            </p>
                          ) : null}
                        </div>

                        <button
                          disabled={product.stock <= 0}
                          onClick={() =>
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price, // UI only; server recalculates totals
                              originalPrice: original || undefined,
                              image: safeImg(product.image_url),
                            })
                          }
                          className={`p-3 rounded-full transition-colors ${
                            product.stock <= 0
                              ? 'bg-cream-200 text-brown-400 cursor-not-allowed'
                              : 'bg-brown-600 text-white hover:bg-brown-700'
                          }`}
                          aria-label="Add to cart"
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
