import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCancel() {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 shadow-card">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-9 w-9 text-white" />
        </div>
        <h1 className="font-serif text-3xl text-brown-800 mb-3">Payment cancelled</h1>
        <p className="text-brown-600 mb-6">
          No charges were made. You can try again whenever you’re ready.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/checkout">
            <Button className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full py-6">
              Back to Checkout
            </Button>
          </Link>
          <Link to="/store">
            <Button variant="outline" className="w-full rounded-full py-6">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
