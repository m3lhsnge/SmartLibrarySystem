import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PublicRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Yükleniyor...</div>
      </div>
    )
  }

  // Eğer kullanıcı giriş yapmışsa ana sayfaya yönlendir
  if (user) {
    return <Navigate to="/home" replace />
  }

  // Giriş yapmamışsa login sayfasına yönlendir
  return <Navigate to="/login" replace />
}

export default PublicRoute

