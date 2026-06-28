import { formatCurrency } from '../utils/formatCurrency'
import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import api from '../services/api'

const categories = [
  'all',
  'cleaning',
  'plumbing',
  'electrical',
  'tutoring',
  'design',
  'delivery',
  'other',
]

const categoryColors = {
  cleaning: 'bg-blue-100 text-blue-700',
  plumbing: 'bg-cyan-100 text-yellow-700',
  electrical: 'bg-yellow-100 text-yellow-700',
  tutoring: 'bg-purple-100 text-purple-700',
  design: 'bg-pink-100 text-pink-700',
  delivery: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
}

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [locationSearch, setLocationSearch] = useState('')

  useEffect(() => {
    fetchServices()
  }, [selectedCategory])

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError('')

      const params = {}
      if (selectedCategory !== 'all') params.category = selectedCategory
      if (locationSearch.trim()) params.location = locationSearch.trim()

      const response = await api.get('/services', {params})
      setServices(response.data)
    } catch (err) {
      setError('Failed to load services. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSearch = (e) => {
    e.preventDefault()
    fetchServices()
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tect-gray-900">Browse Services</h1>
        <p className='text-gray-500 mt-2'>Find trusted local service providers near you</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">

        {/* Location Search */}
        <form onSubmit={handleLocationSearch} className="flex gap-3 mb-6">
          <input type="text"
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
          placeholder="Search by location e.g. Lagos"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
          <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Search
          </button>
          {locationSearch && (
            <button type="button"
            onClick={() => {
              setLocationSearch('')
              setTimeout(fetchServices, 0)
            }}
            className="border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium px-4 py-3 rounded-lg transition-colors">
              Clear
            </button>
          )}
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button 
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && services.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500">Try adjusting your search or selecting a different category</p>
        </div>
      )}

      {/* Services Grid */}
      {!loading && !error && services.length > 0 && (
        <div>
          <p className="text-gray-500 text-sm mb-4">
            {services.length} service{services.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
              key={service.id}
              to={`/services/${service._id}`}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all group">

                {/* Category Badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize mb-4 ${categoryColors[service.category]}`}>
                  {service.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-2xl    font-bold text-blue-600">
                     {formatCurrency(service.price)}
                    </p>
                    <p className="text-sm text-gray-400">per service</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {service.provider?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {service.location}
                    </p>
                  </div>
                </div>

                {/* Availability */}
                <div className="mt-3">
                  <span className={`text-xs font-medium ${service.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                    {service.isAvailable ? '● Available' : '● Unavailable'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Services