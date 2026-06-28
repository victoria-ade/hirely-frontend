import { formatCurrency } from '../utils/formatCurrency'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'

const categories = [
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
  plumbing: 'bg-cyan-100 text-cyan-700',
  electrical: 'bg-yellow-100 text-yellow-700',
  tutoring: 'bg-purple-100 text-purple-700',
  design: 'bg-pink-100 text-pink-700',
  delivery: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
}

// Reusable Service Form Modal
const ServiceModal = ({ isOpen, onClose, onSubmit, defaultValues, loading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {defaultValues?._id ? 'Edit Service' : 'Create New Service'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              placeholder="e.g. Professional House Cleaning"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              placeholder="Describe your service in detail..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
  Price (₦)
</label>
            <input
              {...register('price', {
                required: 'Price is required',
                min: { value: 1, message: 'Price must be at least $1' },
              })}
              type="number"
              placeholder="e.g. 50"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              {...register('location', { required: 'Location is required' })}
              type="text"
              placeholder="e.g. Lagos"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Availability toggle - only show when editing */}
          {defaultValues?._id && (
            <div className="flex items-center gap-3">
              <input
                {...register('isAvailable')}
                type="checkbox"
                id="isAvailable"
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label
                htmlFor="isAvailable"
                className="text-sm font-medium text-gray-700"
              >
                Service is available for booking
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading
                ? 'Saving...'
                : defaultValues?._id
                ? 'Save Changes'
                : 'Create Service'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, loading, serviceName }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 z-10">
        <div className="text-center">
          <div className="text-5xl mb-4">🗑️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Delete Service
          </h2>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-700">"{serviceName}"</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Page Component
const ManageServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [deletingService, setDeletingService] = useState(null)

  useEffect(() => {
    fetchMyServices()
  }, [])

  const fetchMyServices = async () => {
    try {
      setLoading(true)
      const response = await api.get('/services/my-services')
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.services || []
      setServices(data)
    } catch (err) {
      setError('Failed to load your services.')
    } finally {
      setLoading(false)
    }
  }

  const showSuccess = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleCreate = async (data) => {
    try {
      setFormLoading(true)
      const response = await api.post('/services', data)
      setServices((prev) => [response.data, ...prev])
      setShowModal(false)
      showSuccess('Service created successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (data) => {
    try {
      setFormLoading(true)
      const response = await api.put(`/services/${editingService._id}`, data)
      setServices((prev) =>
        prev.map((s) => (s._id === editingService._id ? response.data : s))
      )
      setEditingService(null)
      setShowModal(false)
      showSuccess('Service updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update service.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
  try {
    setDeleteLoading(true)
    await api.delete(`/services/${deletingService._id}`)
    setServices((prev) => prev.filter((s) => s._id !== deletingService._id))
    setDeletingService(null)
    showSuccess('Service deleted successfully!')
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to delete service.')
  } finally {
    setDeleteLoading(false)
  }
 }

  const openCreateModal = () => {
    setEditingService(null)
    setShowModal(true)
  }

  const openEditModal = (service) => {
    setEditingService(service)
    setShowModal(true)
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-500 mt-2">
            Create and manage your service listings
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
        >
          + New Service
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-6 text-sm">
          ✅ {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && services.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No services yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first service listing to start receiving bookings
          </p>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Create Your First Service
          </button>
        </div>
      )}

      {/* Services List */}
      {!loading && services.length > 0 && (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between gap-4">

                {/* Service Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${categoryColors[service.category]}`}>
                      {service.category}
                    </span>
                    <span className={`text-xs font-medium ${service.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                      {service.isAvailable ? '● Available' : '● Unavailable'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-6">
                    <span className="text-blue-600 font-bold text-lg">
  {formatCurrency(service.price)}
</span>
                    <span className="text-gray-400 text-sm">
                      📍 {service.location}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal
                      (service)}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingService(service)}
                    className="border border-red-200 hover:bg-red-50 text-red-500 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <ServiceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingService(null)
        }}
        onSubmit={editingService ? handleUpdate : handleCreate}
        defaultValues={editingService}
        loading={formLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingService}
        onClose={() => setDeletingService(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        serviceName={deletingService?.title}
      />

    </div>
  )
}

export default ManageServices