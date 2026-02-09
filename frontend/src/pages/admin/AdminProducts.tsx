import { useEffect, useMemo, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price?: number | null;
  stock: number;
  description?: string | null;
  image_url?: string | null;
  rating?: number | null;
  reviews?: number | null;
};

export default function AdminProducts() {
  const { hasPerm } = useAuth();
  const canWrite = hasPerm('products', 'write');

  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    id: 0,
    name: '',
    category: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    imageUrl: '',
    description: '',
    rating: 0,
    reviews: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Product[]>('/products');
      setRows(
        data.map((r) => ({
          ...r,
          id: Number(r.id),
          price: Number(r.price || 0),
          stock: Number(r.stock || 0),
          original_price: r.original_price === null || r.original_price === undefined ? null : Number(r.original_price),
          rating: r.rating === null || r.rating === undefined ? null : Number(r.rating),
          reviews: r.reviews === null || r.reviews === undefined ? null : Number(r.reviews),
        }))
      );
    } catch (e: any) {
      setError(e?.message || 'Failed to load products');
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
    return rows.filter((r) => [r.name, r.category].some((v) => String(v || '').toLowerCase().includes(q)));
  }, [rows, search]);

  function startEdit(r: Product) {
    if (!canWrite) return;
    setEditingId(r.id);
    setForm({
      id: r.id,
      name: r.name || '',
      category: r.category || '',
      price: Number(r.price || 0),
      originalPrice: r.original_price ? Number(r.original_price) : 0,
      stock: Number(r.stock || 0),
      imageUrl: String(r.image_url || ''),
      description: String(r.description || ''),
      rating: r.rating ? Number(r.rating) : 0,
      reviews: r.reviews ? Number(r.reviews) : 0,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      id: 0,
      name: '',
      category: '',
      price: 0,
      originalPrice: 0,
      stock: 0,
      imageUrl: '',
      description: '',
      rating: 0,
      reviews: 0,
    });
  }

  async function submit() {
    if (!canWrite) return;
    if (!form.name || !form.category) {
      setError('Name and category are required');
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
        price: Number(form.price),
        stock: Number(form.stock || 0),
        description: form.description || null,
        imageUrl: form.imageUrl || null,
        originalPrice: form.originalPrice > 0 ? Number(form.originalPrice) : null,
        rating: form.rating > 0 ? Number(form.rating) : null,
        reviews: form.reviews > 0 ? Number(form.reviews) : null,
      };

      if (editingId) {
        await apiPut(`/products/${editingId}`, payload);
      } else {
        await apiPost('/products', payload);
      }
      resetForm();
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save product');
    }
  }

  async function remove(id: number) {
    if (!canWrite) return;
    const ok = confirm('Delete this product?');
    if (!ok) return;
    try {
      await apiDelete(`/products/${id}`);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete product');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-brown-800">Products</h2>
          <p className="text-brown-600">Manage store products, stock, and pricing.</p>
        </div>
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:w-80" />
      </div>

      {error && <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800">{error}</div>}

      {canWrite && (
        <Card className="p-5 rounded-2xl shadow-card space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-brown-800">{editingId ? 'Edit Product' : 'Add Product'}</h3>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input type="number" placeholder="Price (USD)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />

            <Input type="number" placeholder="Original Price (optional)" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} />
            <Input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />

            <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input type="number" placeholder="Rating (optional)" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            <Input type="number" placeholder="Reviews (optional)" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: Number(e.target.value) })} />
          </div>

          <Button onClick={submit}>{editingId ? 'Update Product' : 'Create Product'}</Button>
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
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.category}</TableCell>
                <TableCell>${Number(r.price).toFixed(2)}</TableCell>
                <TableCell>{r.stock}</TableCell>
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
