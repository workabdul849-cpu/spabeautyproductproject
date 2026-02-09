import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Scissors,
  Package,
  Users,
  User,
  CalendarDays,
  ShoppingBag,
  Bell,
  Settings,
} from 'lucide-react';

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition',
    isActive
      ? 'bg-brown-700 text-white'
      : 'text-brown-700 hover:bg-brown-100'
  );

export default function AdminLayout() {
  const { user, hasPerm } = useAuth();

  const can = (m: string, a: 'read' | 'write') => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role !== 'staff') return false;
    return hasPerm(m, a);
  };

  const modules = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, show: true },
    { to: '/admin/services', label: 'Services', icon: Scissors, show: can('services', 'read') },
    { to: '/admin/products', label: 'Products', icon: Package, show: can('products', 'read') },
    { to: '/admin/staff', label: 'Staff', icon: Users, show: can('staff', 'read') },
    { to: '/admin/clients', label: 'Clients', icon: User, show: can('clients', 'read') },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays, show: can('bookings', 'read') },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, show: can('orders', 'read') },
    { to: '/admin/notifications', label: 'Notifications', icon: Bell, show: can('notifications', 'write') },
    { to: '/admin/users', label: 'Users', icon: Settings, show: can('users', 'read') },
  ];

  return (
    <div className="pt-28 pb-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="bg-white shadow-card rounded-2xl p-4 h-fit sticky top-28">
          <div className="mb-4">
            <p className="text-xs text-brown-500">Signed in as</p>
            <p className="font-medium text-brown-800">
              {user?.firstName || ''} {user?.lastName || ''}
            </p>
            <p className="text-xs text-brown-600">Role: {user?.role}</p>
          </div>

          <nav className="space-y-1">
            {modules
              .filter((m) => m.show)
              .map((m) => {
                const Icon = m.icon;
                return (
                  <NavLink key={m.to} to={m.to} className={navItemClass} end={m.to === '/admin'}>
                    <Icon className="w-4 h-4" />
                    {m.label}
                  </NavLink>
                );
              })}
          </nav>
        </aside>

        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
