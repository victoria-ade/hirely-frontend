import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-32">
      <div className="text-6xl mb-4">🧭</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Go Home
        </Link>
        <Link
          to="/services"
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Browse Services
        </Link>
      </div>
    </div>
  )
}

export default NotFound