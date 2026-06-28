import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const ProviderDashboard = () => {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch services and bookings at the same time
      const [servicesRes, bookingsRes] = await Promise.all([
        api.get('/services/my-services'),
        api.get('/bookings/provider'),
      ])

      const servicesData = Array.isArray(servicesRes.data)
        ? servicesRes.data
        : servicesRes.data.services || []

      const bookingsData = Array.isArray(bookingsRes.data)
        ? bookingsRes.data
        : bookingsRes.data.bookings || []

      setServices(servicesData)
      setBookings(bookingsData)
    } catch (err) {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  // Derived stats from the data we already fetched
  const totalServices = services.length
  const availableServices = services.filter((s) => s.isAvailable).length
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const completedBookings = bookings.filter((b) => b.status === 'completed').length
  const totalRevenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.service?.price || 0), 0)

  // Most recent 5 bookings for the activity feed
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Here's what's happening with your services today
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm font-medium">Total Services</p>
            <span className="text-2xl">🛠️</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalServices}</p>
          <p className="text-xs text-gray-400 mt-1">{availableServices} available</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm font-medium">Pending Requests</p>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingBookings}</p>
          <p className="text-xs text-gray-400 mt-1">awaiting your response</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm font-medium">Completed Jobs</p>
            <span className="text-2xl">🎉</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{completedBookings}</p>
          <p className="text-xs text-gray-400 mt-1">all time</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">${totalRevenue}</p>
          <p className="text-xs text-gray-400 mt-1">from completed jobs</p>
        </div>

      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/manage-services"
              className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-3 rounded-lg transition-colors"
            >
              <span>Manage My Services</span>
              <span>→</span>
            </Link>
            <Link
              to="/booking-requests"
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-4 py-3 rounded-lg transition-colors"
            >
              <span>
                View Booking Requests
                {pendingBookings > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingBookings}
                  </span>
                )}
              </span>
              <span>→</span>
            </Link>
          </div>

          {totalServices === 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">
                You haven't listed any services yet. Get started by creating your first one.
              </p>
              <Link
                to="/manage-services"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                + Create your first service
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>

          {recentBookings.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 text-sm">
                No booking activity yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {booking.service?.title}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {booking.customer?.name} •{' '}
                      {new Date(booking.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {bookings.length > 5 && (
            <Link
              to="/booking-requests"
              className="block text-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-4 pt-4 border-t border-gray-100"
            >
              View all bookings →
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProviderDashboard