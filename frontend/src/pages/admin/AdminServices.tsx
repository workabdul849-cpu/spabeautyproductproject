import { useEffect, useMemo, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

type Service = {
  id: number;
  name: string;
  category: string;
  duration: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
};

export default function AdminServices() {
  const { hasPerm } = useAuth();
  const canWrite = hasPerm('services', 'write');

  const [rows, setRows] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    id: 0,
    name: '',
    category: '',
    duration: '',
    price: 0,
    description: '',
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Service[]>('/services');
      setRows(data.map((r) => ({ ...r, id: Number(r.id), price: Number(r.price || 0) })));
    } catch (e: any) {
      setError(e?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.category, r.duration].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [rows, search]);

  function startEdit(r: Service) {
    if (!canWrite) return;
    setEditingId(r.id);
    setForm({
      id: r.id,
      name: r.name || '',
      category: r.category || '',
      duration: r.duration || '',
      price: Number(r.price || 0),
      description: String(r.description || ''),
      imageUrl: String(r.image_url || ''),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ id: 0, name: '', category: '', duration: '', price: 0, description: '', imageUrl: '' });
  }

  async function submit() {
    if (!canWrite) return;
    if (!form.name || !form.category || !form.duration) {
      setError('Name, category and duration are required');
      return;
    }
    if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
      setError('Price must be a positive number');
      return;
    }

    setError(null);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        duration: form.duration,
        price: Number(form.price),
        description: form.description || null,
        imageUrl: form.imageUrl || null,
      };

      if (editingId) {
        await apiPut(`/services/${editingId}`, payload);
      } else {
        await apiPost('/services', payload);
      }
      resetForm();
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save service');
    }
  }

  async function remove(id: number) {
    if (!canWrite) return;
    const ok = confirm('Delete this service?');
    if (!ok) return;
    try {
      await apiDelete(`/services/${id}`);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete service');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-brown-800">Services</h2>
          <p className="text-brown-600">Create, update, and remove services.</p>
        </div>
        <Input placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:w-80" />
      </div>

      {error && <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800">{error}</div>}

      {canWrite && (
        <Card className="p-5 rounded-2xl shadow-card space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-brown-800">{editingId ? 'Edit Service' : 'Add Service'}</h3>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Duration (e.g. 45 mins)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            <Input type="number" placeholder="Price (USD)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Button onClick={submit}>{editingId ? 'Update Service' : 'Create Service'}</Button>
        </Card>
      )}

      {loading ? (
        <p className="text-brown-700">Loading…</p>
      ) : (
        <Table className="bg-white rounded-2xl shadow-card">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.category}</TableCell>
                <TableCell>{r.duration}</TableCell>
                <TableCell>${Number(r.price).toFixed(2)}</TableCell>
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
