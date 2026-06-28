import { formatCurrency } from '../utils/formatCurrency'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const categoryColors = {
  cleaning: 'bg-blue-100 text-blue-700',
  plumbing: 'bg-cyan-100 text-cyan-700',
  electrical: 'bg-yellow-100 text-yellow-700',
  tutoring: 'bg-purple-100 text-purple-700',
  design: 'bg-pink-100 text-pink-700',
  delivery: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
}

const ServiceDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [showBookingForm, setShowBookingForm] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // Fetch service on page load
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/services/${id}`)
        setService(response.data)
      } catch (err) {
        setError('Service not found or no longer available.')
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [id])

  const onBookingSubmit = async (data) => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      setBookingLoading(true)
      setBookingError('')
      await api.post('/bookings', {
        serviceId: service._id,
        message: data.message,
        scheduledDate: data.scheduledDate,
      })
      setBookingSuccess(true)
      setShowBookingForm(false)
      reset()
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed. Try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-32">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
        <button
          onClick={() => navigate('/services')}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Services
        </button>
      </div>
    )
  }

  // Determine what the booking button should show
  const isOwnService = user && service.provider?._id === user._id
  const isProvider = user?.role === 'provider'

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back Button */}
      <button
        onClick={() => navigate('/services')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6"
      >
        ← Back to Services
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Service Header */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize mb-4 ${categoryColors[service.category]}`}>
              {service.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {service.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {service.description}
            </p>

            {/* Service Meta */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Location
                </p>
                <p className="text-gray-700 font-medium">{service.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Availability
                </p>
                <span className={`text-sm font-medium ${service.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                  {service.isAvailable ? '● Available' : '● Unavailable'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Category
                </p>
                <p className="text-gray-700 font-medium capitalize">
                  {service.category}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Listed
                </p>
                <p className="text-gray-700 font-medium">
                  {new Date(service.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Provider Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              About the Provider
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {service.provider?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {service.provider?.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {service.provider?.email}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">

            {/* Price */}
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-blue-600">
  {formatCurrency(service.price)}
</p>
              <p className="text-gray-400 text-sm mt-1">per service</p>
            </div>

            {/* Booking Success Message */}
            {bookingSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm text-center">
                🎉 Booking request sent successfully!
              </div>
            )}

            {/* Booking Error */}
            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
                {bookingError}
              </div>
            )}

            {/* Booking Form */}
            {showBookingForm && !bookingSuccess && (
              <form
                onSubmit={handleSubmit(onBookingSubmit)}
                className="space-y-4 mb-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    {...register('scheduledDate', {
                      required: 'Please select a date'
                    })}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  {errors.scheduledDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.scheduledDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    {...register('message')}
                    rows={3}
                    placeholder="Describe what you need..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {bookingLoading ? 'Sending...' : 'Confirm Booking'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Action Button */}
            {!showBookingForm && !bookingSuccess && (
              <>
                {!user && (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Login to Book
                  </button>
                )}
                {user && isOwnService && (
                  <div className="text-center text-gray-400 text-sm py-3">
                    This is your service listing
                  </div>
                )}
                {user && isProvider && !isOwnService && (
                  <div className="text-center text-gray-400 text-sm py-3">
                    Providers cannot book services
                  </div>
                )}
                {user && !isProvider && !isOwnService && (
                  <button
                    onClick={() => setShowBookingForm(true)}
                    disabled={!service.isAvailable}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {service.isAvailable ? 'Book This Service' : 'Not Available'}
                  </button>
                )}
              </>
            )}

            {/* Already booked - view bookings */}
            {bookingSuccess && (
              <button
                onClick={() => navigate('/my-bookings')}
                className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors mt-2"
              >
                View My Bookings
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

export default ServiceDetail