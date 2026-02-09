import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost, apiPut } from '../lib/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'user' | 'admin' | 'staff';
  loyaltyPoints: number;
  referralCode: string;
  favorites: number[];
  preferences: Record<string, unknown>;
  adminPermissions: Record<string, Record<string, boolean>>;
}

export interface Booking {
  id: number;
  date: string;
  time: string;
  status: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  service_id: number;
  service_name: string;
  duration: string;
  price: number;
  staff_id?: number;
  staff_name?: string;
}

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  bookings: Booking[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone: string }) => Promise<boolean>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'favorites' | 'preferences'>>) => Promise<void>;
  hasPerm: (moduleKey: string, action: 'read' | 'write') => boolean;
  createBooking: (payload: { serviceId: number; staffId?: number; date: string; time: string; notes?: string }) => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<void>;
  submitFeedback: (bookingId: number, rating: number, feedback: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setToken(t: string | null) {
  if (t) localStorage.setItem('rj_token', t);
  else localStorage.removeItem('rj_token');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('rj_token'));
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const isAuthenticated = !!token && !!user;

  async function refreshMe() {
    if (!token) {
      setUser(null);
      setBookings([]);
      return;
    }
    try {
      const me = await apiGet<{ user: User }>('/auth/me');
      setUser(me.user);
      const b = await apiGet<Booking[]>('/bookings/mine');
      setBookings(b);
    } catch {
      // token invalid/expired
      setToken(null);
      setTokenState(null);
      setUser(null);
      setBookings([]);
    }
  }

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function login(email: string, password: string) {
    try {
      const res = await apiPost<{ token: string; user: User }>('/auth/login', { email, password });
      setToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      // Load bookings
      const b = await apiGet<Booking[]>('/bookings/mine');
      setBookings(b);
      return true;
    } catch {
      return false;
    }
  }

  async function register(data: { email: string; password: string; firstName: string; lastName: string; phone: string }) {
    try {
      const res = await apiPost<{ token: string; user: User }>('/auth/register', data);
      setToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      setBookings([]);
      return true;
    } catch {
      return false;
    }
  }

  function logout() {
    setToken(null);
    setTokenState(null);
    setUser(null);
    setBookings([]);
  }

  async function updateProfile(data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'favorites' | 'preferences'>>) {
    const res = await apiPut<{ user: User }>('/auth/me', data);
    setUser(res.user);
  }

  function hasPerm(moduleKey: string, action: 'read' | 'write') {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role !== 'staff') return false;
    return user.adminPermissions?.[moduleKey]?.[action] === true;
  }

  async function createBooking(payload: { serviceId: number; staffId?: number; date: string; time: string; notes?: string }) {
    await apiPost('/bookings', payload);
    const b = await apiGet<Booking[]>('/bookings/mine');
    setBookings(b);
    await refreshMe();
  }

  async function cancelBooking(bookingId: number) {
    await apiPut(`/bookings/${bookingId}/cancel`, {});
    const b = await apiGet<Booking[]>('/bookings/mine');
    setBookings(b);
  }

  async function submitFeedback(bookingId: number, rating: number, feedback: string) {
    await apiPut(`/bookings/${bookingId}/feedback`, { rating, feedback });
    const b = await apiGet<Booking[]>('/bookings/mine');
    setBookings(b);
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated,
      bookings,
      login,
      register,
      logout,
      refreshMe,
      updateProfile,
      hasPerm,
      createBooking,
      cancelBooking,
      submitFeedback,
    }),
    [user, token, isAuthenticated, bookings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
