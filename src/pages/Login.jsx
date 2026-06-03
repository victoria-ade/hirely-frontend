import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {useAuth} from '../context/AuthContext'
import api from '../services/api'

const Login = () => {
  const {register, handleSubmit, formState: {errors}} = useForm()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const {login} = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setServerError('')
      const response = await api.post('/auth/login', data)
      login(
        {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        },
        response.data.token
      )
      if (response.data.role === 'provider') {
        navigate('/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your Hirely account</p>
        </div>

        {/* Server Error */}
        {serverError && (<div className="bg-red border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
          {serverError}
        </div>)}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address'
              }
            })}
            type="email"
            placeholder="johndoe@example.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
            {...register('password', {
              required: 'Password is required',
            })}
            type="password"
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors">
            {loading ? 'Sigining in...' : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
        Create one
        </Link>
        </p>
      </div>
    </div>
  )
}

export default Login