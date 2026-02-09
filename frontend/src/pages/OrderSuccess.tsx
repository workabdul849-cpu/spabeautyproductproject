import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const method = params.get('method');

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 shadow-card">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-9 w-9 text-white" />
        </div>
        <h1 className="font-serif text-3xl text-brown-800 mb-3">Order placed!</h1>
        <p className="text-brown-600 mb-6">
          {method === 'cod'
            ? 'Cash on Delivery order created successfully.'
            : 'Your order was created.'}
        </p>

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
      </div>
    </div>
  );
}
