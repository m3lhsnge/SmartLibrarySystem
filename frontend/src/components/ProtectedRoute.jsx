import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-orange-primary">Yükleniyor...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Eğer role belirtilmişse kontrol et
  if (role && user.role !== role) {
    // Rol uyumsuzsa kullanıcıyı kendi paneline yönlendir
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />
    } else if (user.role === 'STUDENT' || user.role === 'STAFF') {
      return <Navigate to="/student" replace />
    }
    return <Navigate to="/home" replace />
  }

  return children
}

export default ProtectedRoute

