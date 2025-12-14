import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { usersAPI } from '../services/api'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      setError('Geçersiz veya eksik token!')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır!')
      return
    }

    if (!token) {
      setError('Token bulunamadı!')
      return
    }

    setLoading(true)

    try {
      await usersAPI.resetPassword(token, password)
      setSuccess('Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...')
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data ||
        'Şifre sıfırlama işlemi başarısız! Token geçersiz veya süresi dolmuş olabilir.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-900 border border-orange-primary/30 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Hata</h1>
          <p className="text-white mb-4">
            Geçersiz veya eksik token. Lütfen mailinizdeki linki kontrol edin.
          </p>
          <Link
            to="/forgot-password"
            className="text-orange-primary hover:text-orange-secondary"
          >
            Yeni şifre sıfırlama linki iste
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 border border-orange-primary/30 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-orange-primary mb-6 text-center">
          Şifre Sıfırla
        </h1>
        <p className="text-gray-400 mb-6 text-center">
          Yeni şifrenizi belirleyin.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Yeni Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
              required
              minLength={6}
              placeholder="En az 6 karakter"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Yeni Şifre Tekrar</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-2 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-primary hover:bg-orange-dark text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>

          <div className="text-center text-gray-400 text-sm">
            <Link to="/login" className="text-orange-primary hover:text-orange-secondary">
              ← Giriş sayfasına dön
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword

