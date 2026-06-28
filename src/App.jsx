import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import MyBookings from './pages/MyBookings'
import ProviderDashboard from './pages/ProviderDashboard'
import ManageServices from './pages/ManageServices'
import BookingRequests from './pages/BookingRequests'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* public routes */}
        <Route index element={<Home />} />
        <Route path="services" element={<Services/>} />
        <Route path="services/:id" element={<ServiceDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected - Customer */}
        <Route element={<ProtectedRoute />}>
          <Route path="my-bookings" element={<MyBookings />} />
        </Route>

        {/* Protected - Provider */}
        <Route element={<ProtectedRoute requireRole="provider" />}>
          <Route path="dashboard" element={<ProviderDashboard />} />
          <Route path="manage-services" element={<ManageServices />} />
          <Route path="booking-requests" element={<BookingRequests />} />
        </Route>
        
              <Route path="*" element={<NotFound />} />

      </Route>

    </Routes>
  )
}

export default App
