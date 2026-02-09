import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function RequirePerm({
  moduleKey,
  action,
  children,
}: {
  moduleKey: string;
  action: 'read' | 'write';
  children: React.JSX.Element;
}) {
  const { user, hasPerm } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // Admin always allowed
  if (user.role === 'admin') return children;

  if (user.role !== 'staff') return <Navigate to="/" replace />;

  if (!hasPerm(moduleKey, action)) return <Navigate to="/admin" replace />;

  return children;
}
