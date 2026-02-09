import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiGet } from '../lib/api';
import { useCart } from '../context/CartContext';

type VerifyResponse = { ok: boolean; orderId?: number; paymentStatus?: string };

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { clearCart } = useCart();

  const [state, setState] = useState<'loading' | 'ok' | 'pending' | 'error'>('loading');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [detail, setDetail] = useState<string>('');

  useEffect(() => {
    if (!sessionId) {
      setState('error');
      setDetail('Missing session_id');
      return;
    }

    setState('loading');
    apiGet<VerifyResponse>(`/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => {
        if (res.ok) {
          setOrderId(res.orderId ?? null);
          clearCart();
          setState('ok');
        } else {
          setState('pending');
          setDetail(res.paymentStatus || 'pending');
        }
      })
      .catch((e: any) => {
        setState('error');
        setDetail(e?.message || 'Verify failed');
      });
  }, [sessionId, clearCart]);

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 shadow-card">
        {state === 'loading' ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-brown-600 mb-5" />
            <h1 className="font-serif text-2xl text-brown-800 mb-2">Verifying payment…</h1>
            <p className="text-brown-600">Please don’t close this page.</p>
          </>
        ) : state === 'ok' ? (
          <>
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-9 w-9 text-white" />
            </div>
            <h1 className="font-serif text-3xl text-brown-800 mb-3">Payment successful ✅</h1>
            <p className="text-brown-600 mb-6">Your order is confirmed.</p>
            {orderId ? (
              <div className="bg-cream-50 rounded-2xl p-4 mb-6">
                <p className="text-brown-600 text-sm">Order ID</p>
                <p className="text-brown-800 font-semibold text-lg">#{orderId}</p>
              </div>
            ) : null}
            <div className="flex flex-col gap-3">
              <Link to="/store">
                <Button className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full py-6">
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full rounded-full py-6">
                  Go to Profile
                </Button>
              </Link>
            </div>
          </>
        ) : state === 'pending' ? (
          <>
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-9 w-9 text-white" />
            </div>
            <h1 className="font-serif text-3xl text-brown-800 mb-3">Payment not completed</h1>
            <p className="text-brown-600 mb-6">
              Stripe says the payment status is: <span className="font-medium">{detail}</span>
            </p>
            <Link to="/checkout">
              <Button className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full py-6">
                Back to Checkout
              </Button>
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-9 w-9 text-white" />
            </div>
            <h1 className="font-serif text-3xl text-brown-800 mb-3">Verification failed</h1>
            <p className="text-brown-600 mb-6">{detail}</p>
            <Link to="/checkout">
              <Button className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full py-6">
                Back to Checkout
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
