import { formatCurrency } from '../utils/formatCurrency'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

const Home = () => {
  const { user } = useAuth()
  const [featuredServices, setFeaturedServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/services')
        const data = Array.isArray(response.data) ? response.data : []
        // Just take the first 3 available services
        setFeaturedServices(data.filter((s) => s.isAvailable).slice(0, 3))
      } catch (err) {
        // Fail silently on the home page - not critical
        setFeaturedServices([])
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div>

      {/* Hero Section */}
      <div className="bg-white -mx-4 -mt-8 px-4 pt-20 pb-16 mb-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
             Trusted by local service providers
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Find trusted local services,{' '}
            <span className="text-blue-600">hassle-free</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            Hirely connects you with verified local providers for cleaning,
            plumbing, tutoring, and more. Book in minutes, not days.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/services"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors"
            >
              Browse Services
            </Link>
            {!user && (
              <Link
                to="/register"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3.5 rounded-lg transition-colors"
              >
                Become a Provider
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          How Hirely Works
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Get the help you need in three simple steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              1. Browse Services
            </h3>
            <p className="text-gray-500 text-sm">
              Search by category or location to find the right provider for your need
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              📅
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              2. Book a Service
            </h3>
            <p className="text-gray-500 text-sm">
              Pick a date, leave a message, and send your request in seconds
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              ✅
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              3. Get It Done
            </h3>
            <p className="text-gray-500 text-sm">
              The provider confirms your booking and shows up ready to help
            </p>
          </div>
        </div>
      </div>

      {/* Featured Services */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Services
            </h2>
            <p className="text-gray-500 mt-1">
              Popular services from trusted providers
            </p>
          </div>
          <Link
            to="/services"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap"
          >
            View all →
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && featuredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-3">🛠️</div>
            <p className="text-gray-500">
              No services available yet. Check back soon!
            </p>
          </div>
        )}

        {!loading && featuredServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <Link
                key={service._id}
                to={`/services/${service._id}`}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize mb-4 ${categoryColors[service.category]}`}>
                  {service.category}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-xl font-bold text-blue-600">
  {formatCurrency(service.price)}
</p>
                  <p className="text-sm text-gray-400">{service.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Final CTA */}
      {!user && (
        <div className="bg-blue-600 rounded-2xl px-8 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to get started?
          </h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            Join Hirely today — whether you need a service or want to offer one
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-lg transition-colors"
          >
            Create Your Free Account
          </Link>
        </div>
      )}

    </div>
  )
}

export default Home