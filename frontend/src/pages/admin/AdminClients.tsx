import { useEffect, useMemo, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

type Client = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  bookings: number;
  loyaltyPoints: number;
};

export default function AdminClients() {
  const { hasPerm } = useAuth();
  const canRead = hasPerm('clients', 'read');
  const canWrite = hasPerm('clients', 'write');

  const [rows, setRows] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    id: 0,
    name: '',
    email: '',
    phone: '',
    bookings: 0,
    loyaltyPoints: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    if (!canRead) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Client[]>('/clients');
      setRows(
        data.map((r) => ({
          ...r,
          id: Number(r.id),
          bookings: Number(r.bookings || 0),
          loyaltyPoints: Number(r.loyaltyPoints || 0),
        }))
      );
    } catch (e: any) {
      setError(e?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [canRead]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.phone].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [rows, search]);

  function startEdit(r: Client) {
    if (!canWrite) return;
    setEditingId(r.id);
    setForm({
      id: r.id,
      name: r.name || '',
      email: String(r.email || ''),
      phone: String(r.phone || ''),
      bookings: Number(r.bookings || 0),
      loyaltyPoints: Number(r.loyaltyPoints || 0),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ id: 0, name: '', email: '', phone: '', bookings: 0, loyaltyPoints: 0 });
  }

  async function submit() {
    if (!canWrite) return;
    if (!form.name) {
      setError('Name is required');
      return;
    }

    setError(null);
    try {
      const payload = {
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        bookings: Number(form.bookings || 0),
        loyaltyPoints: Number(form.loyaltyPoints || 0),
      };

      if (editingId) {
        await apiPut(`/clients/${editingId}`, payload);
      } else {
        await apiPost('/clients', payload);
      }

      resetForm();
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save client');
    }
  }

  async function remove(id: number) {
    if (!canWrite) return;
    const ok = confirm('Delete this client?');
    if (!ok) return;
    try {
      await apiDelete(`/clients/${id}`);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete client');
    }
  }

  if (!canRead) {
    return (
      <div>
        <h2 className="font-serif text-2xl text-brown-800">Clients</h2>
        <p className="text-brown-600 mt-2">You do not have permission to view clients.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-brown-800">Clients</h2>
          <p className="text-brown-600">Client CRM (PII). Access is permission-controlled.</p>
        </div>
        <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:w-80" />
      </div>

      {error && <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800">{error}</div>}

      {canWrite && (
        <Card className="p-5 rounded-2xl shadow-card space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-brown-800">{editingId ? 'Edit Client' : 'Add Client'}</h3>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input type="number" placeholder="Bookings" value={form.bookings} onChange={(e) => setForm({ ...form, bookings: Number(e.target.value) })} />
            <Input type="number" placeholder="Loyalty Points" value={form.loyaltyPoints} onChange={(e) => setForm({ ...form, loyaltyPoints: Number(e.target.value) })} />
          </div>

          <Button onClick={submit}>{editingId ? 'Update Client' : 'Create Client'}</Button>
        </Card>
      )}

      {loading ? (
        <p className="text-brown-700">Loading…</p>
      ) : (
        <Table className="bg-white rounded-2xl shadow-card">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Loyalty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.email || '-'}</TableCell>
                <TableCell>{r.phone || '-'}</TableCell>
                <TableCell>{r.bookings}</TableCell>
                <TableCell>{r.loyaltyPoints}</TableCell>
                <TableCell className="text-right space-x-2">
                  {canWrite ? (
                    <>
                      <Button variant="outline" onClick={() => startEdit(r)}>
                        Edit
                      </Button>
                      <Button variant="outline" onClick={() => remove(r.id)}>
                        Delete
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-brown-500">Read-only</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
