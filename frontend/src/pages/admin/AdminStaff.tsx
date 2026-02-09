import { useEffect, useMemo, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

type Staff = {
  id: number;
  name: string;
  role: string;
  availability: string | null;
  image_url?: string | null;
};

type StaffUser = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'staff';
  admin_permissions: Record<string, any>;
};

const MODULES = [
  'services',
  'products',
  'staff',
  'clients',
  'bookings',
  'orders',
  'notifications',
  'users',
];

export default function AdminStaff() {
  const { user, hasPerm } = useAuth();
  const canWriteStaff = hasPerm('staff', 'write');
  const isAdmin = user?.role === 'admin';

  const [rows, setRows] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    id: 0,
    name: '',
    role: '',
    availability: '',
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Permissions management (admin only)
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [permDraft, setPermDraft] = useState<Record<string, { read: boolean; write: boolean }>>({});

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Staff[]>('/staff');
      setRows(data.map((r) => ({ ...r, id: Number(r.id) })));

      if (isAdmin) {
        const u = await apiGet<StaffUser[]>('/admin/staff');
        setStaffUsers(u);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => [r.name, r.role, r.availability].some((v) => String(v || '').toLowerCase().includes(q)));
  }, [rows, search]);

  function startEdit(r: Staff) {
    if (!canWriteStaff) return;
    setEditingId(r.id);
    setForm({
      id: r.id,
      name: r.name || '',
      role: r.role || '',
      availability: String(r.availability || ''),
      imageUrl: String(r.image_url || ''),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ id: 0, name: '', role: '', availability: '', imageUrl: '' });
  }

  async function submit() {
    if (!canWriteStaff) return;
    if (!form.name || !form.role) {
      setError('Name and role are required');
      return;
    }
    setError(null);
    try {
      const payload = {
        name: form.name,
        role: form.role,
        availability: form.availability || null,
        imageUrl: form.imageUrl || null,
      };
      if (editingId) {
        await apiPut(`/staff/${editingId}`, payload);
      } else {
        await apiPost('/staff', payload);
      }
      resetForm();
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save staff');
    }
  }

  async function remove(id: number) {
    if (!canWriteStaff) return;
    const ok = confirm('Delete this staff member?');
    if (!ok) return;
    try {
      await apiDelete(`/staff/${id}`);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete staff');
    }
  }

  function openPermEditor(u: StaffUser) {
    setSelectedUser(u);
    const current = u.admin_permissions || {};
    const draft: Record<string, { read: boolean; write: boolean }> = {};
    for (const m of MODULES) {
      draft[m] = {
        read: current?.[m]?.read === true,
        write: current?.[m]?.write === true,
      };
    }
    setPermDraft(draft);
  }

  function togglePerm(moduleKey: string, action: 'read' | 'write') {
    setPermDraft((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [action]: !prev[moduleKey]?.[action],
      },
    }));
  }

  async function savePermissions() {
    if (!isAdmin || !selectedUser) return;
    setError(null);
    try {
      await apiPut(`/admin/staff/${selectedUser.id}/permissions`, {
        permissions: permDraft,
      });
      setSelectedUser(null);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to update permissions');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-brown-800">Staff</h2>
          <p className="text-brown-600">Manage staff members and permissions.</p>
        </div>
        <Input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:w-80" />
      </div>

      {error && <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800">{error}</div>}

      {canWriteStaff && (
        <Card className="p-5 rounded-2xl shadow-card space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-brown-800">{editingId ? 'Edit Staff' : 'Add Staff'}</h3>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <Input placeholder="Availability" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
            <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <Button onClick={submit}>{editingId ? 'Update Staff' : 'Create Staff'}</Button>
        </Card>
      )}

      {loading ? (
        <p className="text-brown-700">Loading…</p>
      ) : (
        <Table className="bg-white rounded-2xl shadow-card">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.role}</TableCell>
                <TableCell>{r.availability || '-'}</TableCell>
                <TableCell className="text-right space-x-2">
                  {canWriteStaff ? (
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

      {isAdmin && (
        <Card className="p-5 rounded-2xl shadow-card space-y-4">
          <div>
            <h3 className="font-medium text-brown-800">Staff User Permissions</h3>
            <p className="text-sm text-brown-600">
              This controls what modules a staff user can see inside the admin panel.
            </p>
          </div>

          {staffUsers.length === 0 ? (
            <p className="text-brown-700">No staff users found in users table (role=staff).</p>
          ) : (
            <Table className="bg-white rounded-2xl shadow-card">
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Permissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>
                      {(u.first_name || '') + ' ' + (u.last_name || '')}
                    </TableCell>
                    <TableCell>{u.phone || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" onClick={() => openPermEditor(u)}>
                        Edit Permissions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {selectedUser && (
            <div className="border rounded-2xl p-4 bg-cream-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="font-medium text-brown-800">Editing: {selectedUser.email}</p>
                  <p className="text-xs text-brown-600">Toggle read/write per module</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Close
                  </Button>
                  <Button onClick={savePermissions}>Save</Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {MODULES.map((m) => (
                  <div key={m} className="bg-white rounded-xl p-3 border">
                    <p className="font-medium text-brown-800 capitalize">{m}</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant={permDraft?.[m]?.read ? 'default' : 'outline'}
                        onClick={() => togglePerm(m, 'read')}
                      >
                        Read
                      </Button>
                      <Button
                        type="button"
                        variant={permDraft?.[m]?.write ? 'default' : 'outline'}
                        onClick={() => togglePerm(m, 'write')}
                      >
                        Write
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
