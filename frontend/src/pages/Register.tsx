import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const success = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    });

    if (success) {
      navigate('/profile');
    } else {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-cream-50">
      <div className="max-w-md mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 shadow-card"
        >
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-brown-800 mb-2">Create Account</h1>
            <p className="text-brown-600">Join R&J Beauty Lounge and start earning rewards</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-brown-600 mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brown-400" />
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-brown-600 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brown-600 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brown-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brown-600 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brown-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                  placeholder="+971 50 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brown-600 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brown-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-brown-600 mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start">
              <input type="checkbox" required className="mt-1 mr-2 rounded border-cream-200" />
              <span className="text-sm text-brown-600">
                I agree to the{' '}
                <Link to="/terms" className="text-brown-800 hover:underline">Terms & Conditions</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-brown-800 hover:underline">Privacy Policy</Link>
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full py-6"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-brown-600">
              Already have an account?{' '}
              <Link to="/login" className="text-brown-800 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
