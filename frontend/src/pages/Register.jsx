import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usersAPI } from '../services/api'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validasyon
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor!')
      return
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır!')
      return
    }

    setLoading(true)

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        passwordHash: formData.password, // Backend'de hash'lenecek
        fullName: formData.fullName,
        phone: formData.phone || null,
        role: 'STUDENT', // Kayıt olan herkes öğrenci olarak kayıt olur
      }

      await usersAPI.register(userData)
      setSuccess(
        'Kayıt başarılı! Mail adresinize gönderilen doğrulama linkine tıklayarak hesabınızı aktif edebilirsiniz.'
      )
      
      // 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data ||
        'Kayıt işlemi başarısız! Lütfen bilgilerinizi kontrol edin.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 border border-orange-primary/30 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-orange-primary mb-6 text-center">
          Kayıt Ol
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Ad Soyad *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Kullanıcı Adı *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Telefon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Şifre *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Şifre Tekrar *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
              required
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
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>

          <div className="text-center text-gray-400 text-sm">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-orange-primary hover:text-orange-secondary">
              Giriş Yap
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register

