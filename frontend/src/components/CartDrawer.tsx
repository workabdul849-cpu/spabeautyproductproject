import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatUSD } from '../lib/money';

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-cream-50 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 text-brown-600 mr-3" />
                <h2 className="font-serif text-xl text-brown-800">Your Cart</h2>
                <span className="ml-3 bg-brown-600 text-white text-xs px-2 py-1 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-cream-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-brown-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-cream-300 mx-auto mb-4" />
                  <p className="text-brown-600 mb-4">Your cart is empty</p>
                  <Button
                    onClick={() => setIsCartOpen(false)}
                    variant="outline"
                    className="rounded-full border-brown-600 text-brown-800"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 bg-white rounded-xl p-4"
                    >
                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-brown-800">{item.name}</h3>
                        <p className="text-brown-600 text-sm">{formatUSD(item.price)}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-cream-200 rounded-full">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-cream-100 rounded-l-full transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-cream-100 rounded-r-full transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-cream-200 bg-white">
                <div className="flex justify-between mb-4">
                  <span className="text-brown-600">Subtotal</span>
                  <span className="font-medium text-brown-800">{formatUSD(totalPrice)}</span>
                </div>
                <p className="text-sm text-brown-500 mb-4">Shipping calculated at checkout</p>
                <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                  <Button className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full py-6">
                    Proceed to Checkout
                  </Button>
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-brown-600 hover:text-brown-800 mt-4 text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
