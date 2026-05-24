import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

const Navbar = () => {
  const {user, logout} = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Hirely
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/services" className="text-gray-600 hover:text-blue-600 transition-colors">
            Browse Services
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </>
          ) : (
            <>
              {user.role === 'provider' ? (
                <>
                 <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/manage-services" className="text-gray-600 hover:text-blue-600 transition-colors">
                    My Services
                  </Link>
                  <Link to="/booking-requests" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Bookings
                  </Link>
                </>
              ) : (
                <Link to="/my-bookings" className="text-gray-600 hover:text-blue-600 transition-colors">
                  My Bookings
                </Link>
              )}
              <span className="text-gray-500 text-sm">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-600 transition-colors">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar