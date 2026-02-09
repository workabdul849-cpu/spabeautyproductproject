import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Calendar, Heart, Gift, Star, Settings, 
  LogOut, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { id: 'overview', name: 'Overview', icon: User },
  { id: 'bookings', name: 'My Bookings', icon: Calendar },
  { id: 'favorites', name: 'Favorites', icon: Heart },
  { id: 'rewards', name: 'Rewards', icon: Gift },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export default function Profile() {
  const { user, bookings, logout, cancelBooking, submitFeedback } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; bookingId: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  if (!user) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <h1 className="font-serif text-3xl text-brown-800 mb-4">Please sign in</h1>
        <Link to="/login">
          <Button className="bg-brown-600 hover:bg-brown-700 text-white rounded-full px-8">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitFeedback = () => {
    if (feedbackModal) {
      submitFeedback(feedbackModal.bookingId, rating, feedbackText);
      setFeedbackModal(null);
      setRating(5);
      setFeedbackText('');
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status === 'completed');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-brown-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-serif">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-brown-800">{user.firstName} {user.lastName}</h2>
                  <p className="text-brown-600">{user.email}</p>
                  <p className="text-brown-500 text-sm">{user.phone}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-cream-100 rounded-2xl p-6 text-center">
                <p className="font-serif text-3xl text-brown-800">{user.loyaltyPoints}</p>
                <p className="text-brown-600 text-sm">Loyalty Points</p>
              </div>
              <div className="bg-cream-100 rounded-2xl p-6 text-center">
                <p className="font-serif text-3xl text-brown-800">{bookings.length}</p>
                <p className="text-brown-600 text-sm">Total Bookings</p>
              </div>
              <div className="bg-cream-100 rounded-2xl p-6 text-center">
                <p className="font-serif text-3xl text-brown-800">{upcomingBookings.length}</p>
                <p className="text-brown-600 text-sm">Upcoming</p>
              </div>
            </div>

            {/* Referral Code */}
            <div className="bg-brown-600 rounded-2xl p-6 text-white">
              <h3 className="font-serif text-xl mb-2">Refer a Friend</h3>
              <p className="text-cream-100/80 text-sm mb-4">
                Share your code and earn 100 points for each friend who books!
              </p>
              <div className="flex items-center gap-3">
                <code className="bg-white/10 px-4 py-2 rounded-lg font-mono">{user.referralCode}</code>
                <button
                  onClick={copyReferralCode}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Next Appointment */}
            {upcomingBookings.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="font-serif text-xl text-brown-800 mb-4">Next Appointment</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-brown-800">{upcomingBookings[0].service_name}</p>
                    <p className="text-brown-600 text-sm">
                      {upcomingBookings[0].date} at {upcomingBookings[0].time}
                    </p>
                    <p className="text-brown-500 text-sm">with {upcomingBookings[0].staff_name}</p>
                  </div>
                  <Link to="/book">
                    <Button variant="outline" className="rounded-full border-brown-600 text-brown-800">
                      Reschedule
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            {/* Upcoming */}
            <div>
              <h3 className="font-serif text-xl text-brown-800 mb-4">Upcoming Appointments</h3>
              {upcomingBookings.length === 0 ? (
                <div className="bg-cream-100 rounded-2xl p-8 text-center">
                  <p className="text-brown-600 mb-4">No upcoming appointments</p>
                  <Link to="/book">
                    <Button className="bg-brown-600 hover:bg-brown-700 text-white rounded-full">
                      Book Now
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-brown-800">{booking.service_name}</p>
                          <p className="text-brown-600 text-sm">{booking.date} at {booking.time}</p>
                          <p className="text-brown-500 text-sm">with {booking.staff_name}</p>
                          {booking.add_ons && (
                            <p className="text-brown-500 text-sm mt-1">
                              Add-ons: {booking.add_ons.join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-brown-800">USD {String(booking.price)}</p>
                          <button
                            onClick={() => cancelBooking(String(booking.id))}
                            className="text-red-500 text-sm hover:underline mt-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past */}
            <div>
              <h3 className="font-serif text-xl text-brown-800 mb-4">Past Appointments</h3>
              {pastBookings.length === 0 ? (
                <div className="bg-cream-100 rounded-2xl p-8 text-center">
                  <p className="text-brown-600">No past appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-brown-800">{booking.service_name}</p>
                          <p className="text-brown-600 text-sm">{booking.date} at {booking.time}</p>
                          <p className="text-brown-500 text-sm">with {booking.staff_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-brown-800">USD {String(booking.price)}</p>
                          {booking.rating ? (
                            <div className="flex items-center justify-end gap-1 mt-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < booking.rating! ? 'fill-gold-400 text-gold-400' : 'text-cream-200'}`}
                                />
                              ))}
                            </div>
                          ) : (
                            <button
                              onClick={() => setFeedbackModal({ open: true, bookingId: String(booking.id) })}
                              className="text-brown-600 text-sm hover:underline mt-2"
                            >
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'rewards':
        return (
          <div className="space-y-6">
            {/* Points Card */}
            <div className="bg-brown-600 rounded-2xl p-8 text-white text-center">
              <p className="text-cream-100/80 mb-2">Your Loyalty Points</p>
              <p className="font-serif text-5xl mb-4">{user.loyaltyPoints}</p>
              <p className="text-cream-100/80 text-sm">
                Earn 1 point for every USD 10 spent
              </p>
            </div>

            {/* Rewards */}
            <div>
              <h3 className="font-serif text-xl text-brown-800 mb-4">Available Rewards</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { points: 500, reward: '10% off next service' },
                  { points: 1000, reward: 'Free add-on treatment' },
                  { points: 2000, reward: 'Free facial or massage' },
                  { points: 5000, reward: 'USD 200 store credit' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl p-6 shadow-card ${
                      user.loyaltyPoints >= item.points ? '' : 'opacity-50'
                    }`}
                  >
                    <p className="font-serif text-2xl text-brown-800">{item.points}</p>
                    <p className="text-brown-600">{item.reward}</p>
                    {user.loyaltyPoints >= item.points && (
                      <Button className="mt-4 w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full">
                        Redeem
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-card space-y-6">
            <h3 className="font-serif text-xl text-brown-800">Account Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-brown-600 mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue={user.firstName}
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                />
              </div>
              <div>
                <label className="block text-sm text-brown-600 mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue={user.lastName}
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                />
              </div>
              <div>
                <label className="block text-sm text-brown-600 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                />
              </div>
              <div>
                <label className="block text-sm text-brown-600 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={user.phone}
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-cream-200">
              <label className="flex items-center mb-4">
                <input type="checkbox" defaultChecked className="mr-3" />
                <span className="text-brown-600">Email notifications for bookings</span>
              </label>
              <label className="flex items-center mb-4">
                <input type="checkbox" defaultChecked className="mr-3" />
                <span className="text-brown-600">Marketing emails and promotions</span>
              </label>
            </div>

            <Button className="w-full bg-brown-600 hover:bg-brown-700 text-white rounded-full py-6">
              Save Changes
            </Button>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 text-red-500 py-4 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-card sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brown-600 text-white'
                      : 'text-brown-600 hover:bg-cream-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModal?.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-serif text-xl text-brown-800 mb-4">Rate Your Experience</h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 ${star <= rating ? 'fill-gold-400 text-gold-400' : 'text-cream-200'}`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your experience..."
              className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:border-brown-400 resize-none mb-4"
              rows={4}
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setFeedbackModal(null)}
                variant="outline"
                className="flex-1 rounded-full border-brown-600 text-brown-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                className="flex-1 bg-brown-600 hover:bg-brown-700 text-white rounded-full"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
