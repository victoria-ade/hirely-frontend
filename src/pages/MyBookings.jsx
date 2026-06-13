import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  accepted: 'bg-green-100 text-green-700 border border-green-200',
  rejected: 'bg-red-100 text-red-700 border border-red-200',
  completed: 'bg-blue-100 text-blue-700 border border-blue-200',
}

const statusIcons = {
  pending: '⏳',
  accepted: '✅',
  rejected: '❌',
  completed: '🎉',
}

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/bookings/my-bookings')
      const data = Array.isArray(response.data) 
  ? response.data 
  : response.data.bookings || []
setBookings(data)
    } catch (err) {
      setError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter bookings by status on the frontend
  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter)

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 mt-2">
          Track all your service booking requests
        </p>
      </div>

      {/* Stats Row */}
      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['all', 'pending', 'accepted', 'completed'].map((status) => (
            <div
              key={status}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center"
            >
              <p className="text-2xl font-bold text-gray-900">
                {status === 'all'
                  ? bookings.length
                  : bookings.filter((b) => b.status === status).length}
              </p>
              <p className="text-sm text-gray-500 capitalize mt-1">{status}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'accepted', 'rejected', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bookings yet
          </h3>
          <p className="text-gray-500 mb-6">
            Browse services and make your first booking
          </p>
          <Link
            to="/services"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Browse Services
          </Link>
        </div>
      )}

      {/* Filtered Empty State */}
      {!loading && !error && bookings.length > 0 && filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No {filter} bookings found
          </p>
        </div>
      )}

      {/* Bookings List */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">

                {/* Left - Booking Info */}
                <div className="flex-1">

                  {/* Service Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">
                      {statusIcons[booking.status]}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {booking.service?.title}
                      </h3>
                      <p className="text-gray-500 text-sm capitalize">
                        {booking.service?.category} • {booking.service?.location}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Provider
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {booking.provider?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Scheduled Date
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Price
                      </p>
                      <p className="text-sm font-bold text-blue-600">
                        ${booking.service?.price}
                      </p>
                    </div>
                    {booking.message && (
                      <div className="col-span-2 md:col-span-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                          Your Message
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          "{booking.message}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Booked On */}
                  <p className="text-xs text-gray-400 mt-4">
                    Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>

                </div>

                {/* Right - Status Badge */}
                <div className="shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings