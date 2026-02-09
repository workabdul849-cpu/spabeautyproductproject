import { Link, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export default function MobileBookButton() {
  const location = useLocation();
  
  // Don't show on booking page, login, register, or profile
  const hideOnPaths = ['/book', '/login', '/register', '/profile'];
  if (hideOnPaths.some(path => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-200 p-4 shadow-lg">
      <Link
        to="/book"
        className="flex items-center justify-center gap-2 w-full bg-brown-600 text-white py-3 rounded-full font-medium"
      >
        <Calendar className="h-5 w-5" />
        Book Now
      </Link>
    </div>
  );
}
