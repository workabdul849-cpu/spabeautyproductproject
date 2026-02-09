import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Check, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function ProductDetail() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('/images/product-gel.jpg');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError('');
    apiGet<Product>(`/products/${productId}`)
      .then((p) => {
        setProduct(p);
        const img = safeImg(p.image_url);
        setSelectedImage(img);
      })
      .catch((e) => setError(e?.message || 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [productId]);

  const gallery = useMemo(() => {
    if (!product) return ['/images/product-gel.jpg'];
    const base = safeImg(product.image_url);
    // Keep a simple gallery: main + some fallback lifestyle shots
    const candidates = [base, '/images/social-3.jpg', '/images/social-4.jpg'];
    return Array.from(new Set(candidates));
  }, [product]);

  const maxQty = product ? Math.max(1, product.stock) : 1;

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <p className="text-brown-600">Loading product…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
        <Link to="/store" className="text-brown-600 hover:underline">
          Back to Store
        </Link>
      </div>
    );
  }

  const original = product.original_price ?? undefined;
  const discount =
    original && original > product.price
      ? Math.round(((original - product.price) / original) * 100)
      : null;

  const clampedQty = Math.min(quantity, maxQty);

  return (
    <div className="pt-20">
      {/* Back Button */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cream-200">
        <div className="max-w-7xl mx-auto">
          <Link to="/store" className="inline-flex items-center text-brown-600 hover:text-brown-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Link>
        </div>
      </div>

      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <ScrollReveal>
              <div>
                <div className="relative bg-cream-100 rounded-3xl overflow-hidden mb-4">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-[500px] object-cover"
                  />
                  {discount ? (
                    <div className="absolute top-6 left-6 bg-brown-600 text-white px-4 py-2 rounded-full">
                      {discount}% OFF
                    </div>
                  ) : null}
                  {product.stock <= 0 ? (
                    <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full">
                      Out of stock
                    </div>
                  ) : null}
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3">
                  {gallery.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                        selectedImage === img ? 'border-brown-600' : 'border-transparent hover:border-brown-300'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Details */}
            <ScrollReveal delay={0.2}>
              <div>
                <p className="text-brown-500 mb-2">{product.category}</p>
                <h1 className="font-serif text-4xl text-brown-800 mb-4">{product.name}</h1>

                {/* Rating */}
                {product.rating ? (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-current text-brown-600" />
                      <span className="ml-1 text-brown-800 font-medium">
                        {Number(product.rating).toFixed(1)}
                      </span>
                    </div>
                    {product.reviews ? (
                      <span className="text-brown-500">({product.reviews} reviews)</span>
                    ) : null}
                    <span className="text-brown-500">·</span>
                    <span className="text-brown-500">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                ) : (
                  <div className="text-brown-500 mb-6">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
                )}

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-semibold text-brown-800">{formatUSD(product.price)}</span>
                  {original && original > product.price ? (
                    <span className="text-xl text-brown-400 line-through">{formatUSD(original)}</span>
                  ) : null}
                </div>

                {/* Description */}
                {product.description ? (
                  <p className="text-brown-600 leading-relaxed mb-8">{product.description}</p>
                ) : (
                  <p className="text-brown-600 leading-relaxed mb-8">No description provided.</p>
                )}

                {/* Quantity */}
                <div className="mb-8">
                  <label className="block text-sm text-brown-600 mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-cream-200 rounded-full">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-3 hover:bg-cream-50 rounded-l-full"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4 text-brown-600" />
                      </button>
                      <span className="px-6 py-3 text-brown-800 font-medium min-w-[64px] text-center">
                        {clampedQty}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                        className="p-3 hover:bg-cream-50 rounded-r-full"
                        aria-label="Increase quantity"
                        disabled={product.stock <= 0}
                      >
                        <Plus className="h-4 w-4 text-brown-600" />
                      </button>
                    </div>
                    <span className="text-brown-500 text-sm">
                      {product.stock > 0 ? `${product.stock} available` : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={() => {
                    if (product.stock <= 0) return;
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price, // UI only; server recalculates totals
                      originalPrice: original || undefined,
                      image: safeImg(product.image_url),
                    });
                  }}
                  disabled={product.stock <= 0}
                  className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full py-6 text-lg mb-4"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>

                {/* Benefits */}
                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-brown-600 mt-1" />
                    <div>
                      <p className="text-brown-800 font-medium">Fast Delivery</p>
                      <p className="text-brown-600 text-sm">Delivered in 2-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-brown-600 mt-1" />
                    <div>
                      <p className="text-brown-800 font-medium">Secure Checkout</p>
                      <p className="text-brown-600 text-sm">Payments handled via Stripe</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-brown-600 mt-1" />
                    <div>
                      <p className="text-brown-800 font-medium">Easy Returns</p>
                      <p className="text-brown-600 text-sm">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brown-600 mt-1" />
                    <div>
                      <p className="text-brown-800 font-medium">Premium Quality</p>
                      <p className="text-brown-600 text-sm">Carefully selected ingredients</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
