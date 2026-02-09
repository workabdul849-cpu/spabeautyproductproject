import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Scissors,
  Users,
  User as UserIcon,
  Package as PackageIcon,
  BarChart2,
  Bell,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { apiDelete, apiGet, apiPost } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Admin dashboard page
 *
 * This page is a prototype administrative dashboard.
 *
 * ✅ Persisted (API + PostgreSQL): services, staff, clients, products
 * 🟡 Demo-only (in-memory): analytics, notifications, loyalty programs
 */

interface Service {
  id: number;
  name: string;
  category: string;
  duration: string;
  price: number;
}

interface Staff {
  id: number;
  name: string;
  role: string;
  availability: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  bookings: number;
  loyaltyPoints: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface Notification {
  id: string;
  subject: string;
  message: string;
  date: string;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
}

export default function Admin() {
  // Define tab configuration with human friendly names and icons
  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'services', name: 'Services', icon: Scissors },
    { id: 'staff', name: 'Staff', icon: Users },
    { id: 'clients', name: 'Clients', icon: UserIcon },
    { id: 'products', name: 'Products', icon: PackageIcon },
    { id: 'analytics', name: 'Analytics', icon: BarChart2 },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'loyalty', name: 'Loyalty', icon: Gift },
  ];

  const [activeTab, setActiveTab] = useState<string>('overview');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // In‑memory state for each data domain. A real implementation would
  // persist this to a server or database.
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgram[]>([
    { id: '1', name: 'Gold Membership', description: 'Earn 2× points on all services and products.' },
    { id: '2', name: 'Referral Bonus', description: 'Get 100 points for each friend who books an appointment.' },
  ]);

  // Form state for creating new entries. Each domain has its own local
  // controlled inputs. Empty strings denote unfilled fields.
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({ name: '', category: '', duration: '', price: 0 });
  const [newStaff, setNewStaff] = useState<Omit<Staff, 'id'>>({ name: '', role: '', availability: '' });
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
    name: '',
    email: '',
    phone: '',
    bookings: 0,
    loyaltyPoints: 0,
  });
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ name: '', category: '', price: 0, stock: 0 });
  const [newNotification, setNewNotification] = useState<{ subject: string; message: string }>({ subject: '', message: '' });
  const [newLoyalty, setNewLoyalty] = useState<Omit<LoyaltyProgram, 'id'>>({ name: '', description: '' });

  // Load all admin data from the API on first render.
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [svcRows, staffRows, clientRows, productRows] = await Promise.all([
          apiGet<any[]>('/services'),
          apiGet<any[]>('/staff'),
          apiGet<any[]>('/clients'),
          apiGet<any[]>('/products'),
        ]);

        // Normalize numeric fields (Postgres can return NUMERIC as a string)
        setServices(
          svcRows.map((r) => ({
            id: Number(r.id),
            name: String(r.name || ''),
            category: String(r.category || ''),
            duration: String(r.duration || ''),
            price: Number(r.price || 0),
          }))
        );
        setStaff(
          staffRows.map((r) => ({
            id: Number(r.id),
            name: String(r.name || ''),
            role: String(r.role || ''),
            availability: String(r.availability || ''),
          }))
        );
        setClients(
          clientRows.map((r) => ({
            id: Number(r.id),
            name: String(r.name || ''),
            email: String(r.email || ''),
            phone: String(r.phone || ''),
            bookings: Number(r.bookings || 0),
            loyaltyPoints: Number(r.loyaltyPoints || 0),
          }))
        );
        setProducts(
          productRows.map((r) => ({
            id: Number(r.id),
            name: String(r.name || ''),
            category: String(r.category || ''),
            price: Number(r.price || 0),
            stock: Number(r.stock || 0),
          }))
        );
      } catch (e: any) {
        setError(e?.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function reloadServices() {
    const svcRows = await apiGet<any[]>('/services');
    setServices(
      svcRows.map((r) => ({
        id: Number(r.id),
        name: String(r.name || ''),
        category: String(r.category || ''),
        duration: String(r.duration || ''),
        price: Number(r.price || 0),
      }))
    );
  }

  async function reloadStaff() {
    const rows = await apiGet<any[]>('/staff');
    setStaff(
      rows.map((r) => ({
        id: Number(r.id),
        name: String(r.name || ''),
        role: String(r.role || ''),
        availability: String(r.availability || ''),
      }))
    );
  }

  async function reloadClients() {
    const rows = await apiGet<any[]>('/clients');
    setClients(
      rows.map((r) => ({
        id: Number(r.id),
        name: String(r.name || ''),
        email: String(r.email || ''),
        phone: String(r.phone || ''),
        bookings: Number(r.bookings || 0),
        loyaltyPoints: Number(r.loyaltyPoints || 0),
      }))
    );
  }

  async function reloadProducts() {
    const rows = await apiGet<any[]>('/products');
    setProducts(
      rows.map((r) => ({
        id: Number(r.id),
        name: String(r.name || ''),
        category: String(r.category || ''),
        price: Number(r.price || 0),
        stock: Number(r.stock || 0),
      }))
    );
  }

  // Handlers for adding entries (API-backed)
  const addService = async () => {
    if (!newService.name || !newService.category || !newService.duration || !newService.price) return;
    setError(null);
    try {
      await apiPost('/services', newService);
      setNewService({ name: '', category: '', duration: '', price: 0 });
      await reloadServices();
    } catch (e: any) {
      setError(e?.message || 'Failed to add service');
    }
  };

  const addStaff = async () => {
    if (!newStaff.name || !newStaff.role) return;
    setError(null);
    try {
      await apiPost('/staff', newStaff);
      setNewStaff({ name: '', role: '', availability: '' });
      await reloadStaff();
    } catch (e: any) {
      setError(e?.message || 'Failed to add staff');
    }
  };

  const addClient = async () => {
    if (!newClient.name) return;
    setError(null);
    try {
      await apiPost('/clients', newClient);
      setNewClient({ name: '', email: '', phone: '', bookings: 0, loyaltyPoints: 0 });
      await reloadClients();
    } catch (e: any) {
      setError(e?.message || 'Failed to add client');
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) return;
    setError(null);
    try {
      await apiPost('/products', newProduct);
      setNewProduct({ name: '', category: '', price: 0, stock: 0 });
      await reloadProducts();
    } catch (e: any) {
      setError(e?.message || 'Failed to add product');
    }
  };

  const deleteService = async (id: number) => {
    setError(null);
    try {
      await apiDelete(`/services/${id}`);
      await reloadServices();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete service');
    }
  };

  const deleteStaff = async (id: number) => {
    setError(null);
    try {
      await apiDelete(`/staff/${id}`);
      await reloadStaff();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete staff');
    }
  };

  const deleteClient = async (id: number) => {
    setError(null);
    try {
      await apiDelete(`/clients/${id}`);
      await reloadClients();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete client');
    }
  };

  const deleteProduct = async (id: number) => {
    setError(null);
    try {
      await apiDelete(`/products/${id}`);
      await reloadProducts();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete product');
    }
  };
  const addNotification = () => {
    if (!newNotification.subject || !newNotification.message) return;
    setNotifications([
      ...notifications,
      {
        id: Math.random().toString(36).substring(2, 9),
        subject: newNotification.subject,
        message: newNotification.message,
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    setNewNotification({ subject: '', message: '' });
  };
  const addLoyalty = () => {
    if (!newLoyalty.name || !newLoyalty.description) return;
    setLoyaltyPrograms([
      ...loyaltyPrograms,
      { id: Math.random().toString(36).substring(2, 9), ...newLoyalty },
    ]);
    setNewLoyalty({ name: '', description: '' });
  };

  // Dummy analytics data – aggregated monthly totals for revenue and
  // bookings. These values are hardcoded for nstration. In a
  // realistic setup these would come from your sales database or
  // analytics API.
  const analyticsData = [
    { month: 'Jan', revenue: 3200, bookings: 28 },
    { month: 'Feb', revenue: 4500, bookings: 32 },
    { month: 'Mar', revenue: 3800, bookings: 30 },
    { month: 'Apr', revenue: 5000, bookings: 36 },
    { month: 'May', revenue: 6100, bookings: 40 },
    { month: 'Jun', revenue: 5400, bookings: 33 },
  ];

  // Render functions for each tab. Each tab returns a fragment of JSX.
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 bg-white shadow-card rounded-2xl">
        <p className="text-sm text-brown-600">Services</p>
        <p className="text-3xl font-serif text-brown-800 mt-2">{services.length}</p>
      </Card>
      <Card className="p-6 bg-white shadow-card rounded-2xl">
        <p className="text-sm text-brown-600">Staff</p>
        <p className="text-3xl font-serif text-brown-800 mt-2">{staff.length}</p>
      </Card>
      <Card className="p-6 bg-white shadow-card rounded-2xl">
        <p className="text-sm text-brown-600">Clients</p>
        <p className="text-3xl font-serif text-brown-800 mt-2">{clients.length}</p>
      </Card>
      <Card className="p-6 bg-white shadow-card rounded-2xl">
        <p className="text-sm text-brown-600">Products</p>
        <p className="text-3xl font-serif text-brown-800 mt-2">{products.length}</p>
      </Card>
      <Card className="p-6 bg-white shadow-card rounded-2xl">
        <p className="text-sm text-brown-600">Notifications Sent</p>
        <p className="text-3xl font-serif text-brown-800 mt-2">{notifications.length}</p>
      </Card>
      <Card className="p-6 bg-white shadow-card rounded-2xl">
        <p className="text-sm text-brown-600">Loyalty Programs</p>
        <p className="text-3xl font-serif text-brown-800 mt-2">{loyaltyPrograms.length}</p>
      </Card>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-brown-800">Manage Services</h2>
      {/* Form to add a new service */}
      <div className="bg-white rounded-2xl p-4 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Input
            placeholder="Name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={newService.category}
            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
          />
          <Input
            placeholder="Duration"
            value={newService.duration}
            onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
          />
        </div>
        <Button className="mt-2" onClick={addService}>Add Service</Button>
      </div>
      {/* Table of services */}
      <Table className="bg-white rounded-2xl shadow-card">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Price (USD)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((svc) => (
            <TableRow key={svc.id}>
              <TableCell>{svc.name}</TableCell>
              <TableCell>{svc.category}</TableCell>
              <TableCell>{svc.duration}</TableCell>
              <TableCell>{svc.price}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" onClick={() => deleteService(svc.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderStaff = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-brown-800">Manage Staff</h2>
      <div className="bg-white rounded-2xl p-4 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Name"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          />
          <Input
            placeholder="Role"
            value={newStaff.role}
            onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
          />
          <Input
            placeholder="Availability"
            value={newStaff.availability}
            onChange={(e) => setNewStaff({ ...newStaff, availability: e.target.value })}
          />
        </div>
        <Button className="mt-2" onClick={addStaff}>Add Staff</Button>
      </div>
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
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.availability}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" onClick={() => deleteStaff(member.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-brown-800">Client CRM</h2>
      <div className="bg-white rounded-2xl p-4 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <Input
            placeholder="Name"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={newClient.phone}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Bookings"
            value={newClient.bookings}
            onChange={(e) => setNewClient({ ...newClient, bookings: parseInt(e.target.value) || 0 })}
          />
          <Input
            type="number"
            placeholder="Loyalty Points"
            value={newClient.loyaltyPoints}
            onChange={(e) => setNewClient({ ...newClient, loyaltyPoints: parseInt(e.target.value) || 0 })}
          />
        </div>
        <Button className="mt-2" onClick={addClient}>Add Client</Button>
      </div>
      <Table className="bg-white rounded-2xl shadow-card">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Loyalty Points</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>{c.bookings}</TableCell>
              <TableCell>{c.loyaltyPoints}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" onClick={() => deleteClient(c.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-brown-800">Manage Products</h2>
      <div className="bg-white rounded-2xl p-4 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Input
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
          />
        </div>
        <Button className="mt-2" onClick={addProduct}>Add Product</Button>
      </div>
      <Table className="bg-white rounded-2xl shadow-card">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price (USD)</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>{p.price}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" onClick={() => deleteProduct(p.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-brown-800">Analytics</h2>
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <h3 className="font-medium text-brown-700 mb-4">Monthly Revenue & Bookings</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#5C4A32" />
              <YAxis yAxisId="left" stroke="#5C4A32" />
              <YAxis yAxisId="right" orientation="right" stroke="#B8956A" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="revenue" barSize={20} fill="#5C4A32" name="Revenue (USD)" />
              <Bar yAxisId="right" dataKey="bookings" barSize={20} fill="#B8956A" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-brown-800">Automated Notifications</h2>
      {/* Form to create a new notification */}
      <div className="bg-white rounded-2xl p-4 shadow-card space-y-4">
        <Input
          placeholder="Subject"
          value={newNotification.subject}
          onChange={(e) => setNewNotification({ ...newNotification, subject: e.target.value })}
        />
        <textarea
          className="w-full p-2 border rounded-md text-sm"
          rows={4}
          placeholder="Message"
          value={newNotification.message}
          onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
        />
        <Button onClick={addNotification}>Send Notification</Button>
      </div>
      {/* List of sent notifications */}
      {notifications.length === 0 ? (
        <p className="text-brown-600">No notifications sent yet.</p>
      ) : (
        <Table className="bg-white rounded-2xl shadow-card">
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((n) => (
              <TableRow key={n.id}>
                <TableCell>{n.subject}</TableCell>
                <TableCell>{n.message}</TableCell>
                <TableCell>{n.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  const renderLoyalty = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-brown-800">Loyalty Programs & Gift Cards</h2>
      {/* Form to create a new loyalty program */}
      <div className="bg-white rounded-2xl p-4 shadow-card space-y-4">
        <Input
          placeholder="Name"
          value={newLoyalty.name}
          onChange={(e) => setNewLoyalty({ ...newLoyalty, name: e.target.value })}
        />
        <textarea
          className="w-full p-2 border rounded-md text-sm"
          rows={3}
          placeholder="Description"
          value={newLoyalty.description}
          onChange={(e) => setNewLoyalty({ ...newLoyalty, description: e.target.value })}
        />
        <Button onClick={addLoyalty}>Add Program</Button>
      </div>
      <Table className="bg-white rounded-2xl shadow-card">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loyaltyPrograms.map((lp) => (
            <TableRow key={lp.id}>
              <TableCell>{lp.name}</TableCell>
              <TableCell>{lp.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Determine which content to show based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'services':
        return renderServices();
      case 'staff':
        return renderStaff();
      case 'clients':
        return renderClients();
      case 'products':
        return renderProducts();
      case 'analytics':
        return renderAnalytics();
      case 'notifications':
        return renderNotifications();
      case 'loyalty':
        return renderLoyalty();
      default:
        return null;
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 lg:px-8">
      <h1 className="font-serif text-3xl text-brown-800 mb-6">Admin Dashboard</h1>
      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'outline'}
              className={cn('rounded-full', isActive && 'bg-brown-600 text-white hover:bg-brown-700')}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.name}
            </Button>
          );
        })}
      </div>
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-brown-700">Loading data from backend…</p>
      ) : (
        renderContent()
      )}
    </div>
  );
}