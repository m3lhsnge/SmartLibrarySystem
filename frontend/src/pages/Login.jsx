import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    setLoading(false)

    if (result.success) {
      // Giriş yaptıktan sonra ana sayfaya yönlendir
      navigate('/home')
    } else {
      setError(result.error || 'Giriş başarısız')
      // Hata olduğunda şifreyi temizle
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 border border-orange-primary/30 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-orange-primary mb-6 text-center">
          Kütüphane Yönetim Sistemi
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
              required
            />
          </div>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-primary hover:bg-orange-dark text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>

          <div className="flex justify-between items-center text-sm">
            <Link
              to="/forgot-password"
              className="text-orange-primary hover:text-orange-secondary"
            >
              Şifremi Unuttum
            </Link>
            <Link
              to="/register"
              className="text-orange-primary hover:text-orange-secondary"
            >
              Kayıt Ol
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

