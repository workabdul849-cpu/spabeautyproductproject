import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import MobileBookButton from './components/MobileBookButton';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import SingleService from './pages/SingleService';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Book from './pages/Book';
import Gallery from './pages/Gallery';
import FAQs from './pages/FAQs';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Returns from './pages/Returns';
import Accessibility from './pages/Accessibility';
import Admin from './pages/Admin';
import AdminRoute from './components/AdminRoute';
import RequirePerm from './components/RequirePerm';

import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminServices from './pages/admin/AdminServices';
import AdminProducts from './pages/admin/AdminProducts';
import AdminStaff from './pages/admin/AdminStaff';
import AdminClients from './pages/admin/AdminClients';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-cream-50">
            <Header />
            <CartDrawer />
            <main className="pb-20 lg:pb-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:serviceId" element={<SingleService />} />
                <Route path="/store" element={<Store />} />
                <Route path="/store/:productId" element={<ProductDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:postId" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                <Route path="/payment/cancel" element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/book" element={<ProtectedRoute><Book /></ProtectedRoute>} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/accessibility" element={<Accessibility />} />

                {/* Real admin panel */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminOverview />} />
                  <Route
                    path="services"
                    element={
                      <RequirePerm moduleKey="services" action="read">
                        <AdminServices />
                      </RequirePerm>
                    }
                  />
                  <Route
                    path="products"
                    element={
                      <RequirePerm moduleKey="products" action="read">
                        <AdminProducts />
                      </RequirePerm>
                    }
                  />
                  <Route
                    path="staff"
                    element={
                      <RequirePerm moduleKey="staff" action="read">
                        <AdminStaff />
                      </RequirePerm>
                    }
                  />
                  <Route
                    path="clients"
                    element={
                      <RequirePerm moduleKey="clients" action="read">
                        <AdminClients />
                      </RequirePerm>
                    }
                  />
                  <Route
                    path="bookings"
                    element={
                      <RequirePerm moduleKey="bookings" action="read">
                        <AdminPlaceholder title="Bookings" />
                      </RequirePerm>
                    }
                  />
                  <Route
                    path="orders"
                    element={
                      <RequirePerm moduleKey="orders" action="read">
                        <AdminPlaceholder title="Orders" />
                      </RequirePerm>
                    }
                  />
                  <Route
                    path="notifications"
                    element={
                      <RequirePerm moduleKey="notifications" action="write">
                        <AdminPlaceholder title="Notifications" />
                      </RequirePerm>
                    }
                  />
                  <Route
                    path="users"
                    element={
                      <RequirePerm moduleKey="users" action="read">
                        <AdminPlaceholder title="Users" />
                      </RequirePerm>
                    }
                  />
                </Route>
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
            <MobileBookButton />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
