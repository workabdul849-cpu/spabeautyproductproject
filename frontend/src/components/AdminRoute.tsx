import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Guards admin/staff routes. This is NOT a security boundary (backend is),
// but it prevents accidental UI access and improves UX.

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  const role = user?.role || 'user';
  if (role !== 'admin' && role !== 'staff') {
    return <Navigate to="/" replace />;
  }

  return children;
}
