import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminOverview() {
  const { hasPerm, user } = useAuth();
  const [stats, setStats] = useState({
    services: 0,
    products: 0,
    staff: 0,
    clients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [svc, prod, st, cl] = await Promise.all([
          hasPerm('services', 'read') ? apiGet<any[]>('/services') : Promise.resolve([]),
          hasPerm('products', 'read') ? apiGet<any[]>('/products') : Promise.resolve([]),
          hasPerm('staff', 'read') ? apiGet<any[]>('/staff') : Promise.resolve([]),
          hasPerm('clients', 'read') ? apiGet<any[]>('/clients') : Promise.resolve([]),
        ]);

        setStats({
          services: svc.length,
          products: prod.length,
          staff: st.length,
          clients: cl.length,
        });
      } catch (e: any) {
        setError(e?.message || 'Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    })();
  }, [hasPerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-brown-800">Admin Dashboard</h1>
        <p className="text-brown-600 mt-1">
          Welcome back, {user?.firstName || 'User'}.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800">{error}</div>
      )}

      {loading ? (
        <p className="text-brown-700">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 rounded-2xl shadow-card">
            <p className="text-sm text-brown-600">Services</p>
            <p className="text-3xl font-serif text-brown-800 mt-2">{stats.services}</p>
          </Card>
          <Card className="p-5 rounded-2xl shadow-card">
            <p className="text-sm text-brown-600">Products</p>
            <p className="text-3xl font-serif text-brown-800 mt-2">{stats.products}</p>
          </Card>
          <Card className="p-5 rounded-2xl shadow-card">
            <p className="text-sm text-brown-600">Staff</p>
            <p className="text-3xl font-serif text-brown-800 mt-2">{stats.staff}</p>
          </Card>
          <Card className="p-5 rounded-2xl shadow-card">
            <p className="text-sm text-brown-600">Clients</p>
            <p className="text-3xl font-serif text-brown-800 mt-2">{stats.clients}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
