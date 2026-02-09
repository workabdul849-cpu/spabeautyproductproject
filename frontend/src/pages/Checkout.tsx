import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Truck, Check, Lock, CreditCard, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiPost } from '../lib/api';
import { formatUSD } from '../lib/money';

type CreateOrderResponse = { orderId: number };
type CreateStripeResponse = { url: string; sessionId: string; orderId: number };

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const cartLines = useMemo(
    () => items.map((i) => ({ productId: i.id, qty: i.quantity })),
    [items]
  );

  const shippingAddress = useMemo(
    () => ({
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      email: formData.email,
    }),
    [formData]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep(2);
  };

  async function placeCOD() {
    setSubmitting(true);
    setError('');
    try {
      const res = await apiPost<CreateOrderResponse>('/orders', {
        items: cartLines,
        shippingAddress,
        phone: formData.phone,
      });
      clearCart();
      navigate(`/order/success?orderId=${res.orderId}&method=cod`);
    } catch (e: any) {
      setError(e?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  }

  async function payWithStripe() {
    setSubmitting(true);
    setError('');
    try {
      const res = await apiPost<CreateStripeResponse>('/payments/create-checkout-session', {
        items: cartLines,
        shippingAddress,
        phone: formData.phone,
      });
      // Redirect to Stripe-hosted checkout
      window.location.href = res.url;
    } catch (e: any) {
      setError(e?.message || 'Failed to start Stripe checkout');
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <h1 className="font-serif text-3xl text-brown-800 mb-4">Your cart is empty</h1>
        <Link to="/store" className="text-brown-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cream-200">
        <div className="max-w-7xl mx-auto">
          <Link to="/store" className="inline-flex items-center text-brown-600 hover:text-brown-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left */}
            <ScrollReveal>
              <div>
                {/* Progress */}
                <div className="flex items-center mb-8">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-brown-600 text-white' : 'bg-cream-200 text-brown-600'}`}>
                    1
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-brown-600' : 'bg-cream-200'}`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-brown-600 text-white' : 'bg-cream-200 text-brown-600'}`}>
                    2
                  </div>
                </div>

                <h1 className="font-serif text-2xl text-brown-800 mb-2">
                  {step === 1 ? 'Shipping Information' : 'Payment'}
                </h1>
                <p className="text-brown-600 mb-6 text-sm">
                  Note: totals are calculated server-side (USD). Client-side prices are treated as display only.
                </p>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
                    {error}
                  </div>
                )}

                {step === 1 ? (
                  <form onSubmit={next} className="space-y-4">
                    <div>
                      <label className="block text-sm text-brown-600 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-brown-600 mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-brown-600 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-brown-600 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-brown-600 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-brown-600 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                        placeholder="+1 555 123 4567"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full py-6 mt-4"
                    >
                      Continue to Payment
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-cream-100 rounded-xl p-4">
                      <div className="flex items-center text-brown-600 mb-2">
                        <Truck className="h-5 w-5 mr-2" />
                        <span>Deliver to:</span>
                      </div>
                      <p className="text-brown-800 font-medium">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-brown-600">{formData.address}</p>
                      <p className="text-brown-600">{formData.city}</p>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-brown-600 hover:text-brown-800 text-sm mt-2 underline"
                      >
                        Change
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-cream-200 p-5">
                      <h2 className="font-serif text-lg text-brown-800 mb-4">Choose payment method</h2>

                      <div className="grid gap-3">
                        <button
                          onClick={payWithStripe}
                          disabled={submitting}
                          className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-cream-200 hover:border-brown-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-brown-600" />
                            <div className="text-left">
                              <p className="text-brown-800 font-medium">Card (Stripe)</p>
                              <p className="text-brown-500 text-sm">Pay securely with Stripe checkout</p>
                            </div>
                          </div>
                          <span className="text-brown-600">→</span>
                        </button>

                        <button
                          onClick={placeCOD}
                          disabled={submitting}
                          className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-cream-200 hover:border-brown-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Banknote className="h-5 w-5 text-brown-600" />
                            <div className="text-left">
                              <p className="text-brown-800 font-medium">Cash on Delivery</p>
                              <p className="text-brown-500 text-sm">Place order, pay at delivery</p>
                            </div>
                          </div>
                          <span className="text-brown-600">→</span>
                        </button>
                      </div>

                      <div className="flex items-center text-sm text-brown-500 mt-4">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>Your payment details are handled securely</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Right - Order Summary */}
            <ScrollReveal delay={0.2}>
              <div className="bg-cream-100 rounded-2xl p-6 lg:p-8">
                <h2 className="font-serif text-xl text-brown-800 mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-brown-600 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-brown-800 font-medium">{item.name}</p>
                        <p className="text-brown-500 text-sm">{formatUSD(item.price)}</p>
                      </div>
                      <p className="text-brown-800 font-medium">
                        {formatUSD(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-cream-200 pt-4 space-y-2">
                  <div className="flex justify-between text-brown-600">
                    <span>Subtotal</span>
                    <span>{formatUSD(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-brown-600">
                    <span>Shipping</span>
                    <span>Calculated by store</span>
                  </div>
                  <div className="flex justify-between text-brown-800 font-medium text-lg pt-2 border-t border-cream-200">
                    <span>Estimated total</span>
                    <span>{formatUSD(totalPrice)}</span>
                  </div>
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 flex items-center text-green-700 text-sm"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Server calculates final totals (no client-side price trust).
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
