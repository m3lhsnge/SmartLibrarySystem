import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usersAPI } from '../services/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await usersAPI.forgotPassword(email)
      setSuccess('Şifre sıfırlama linki mail adresinize gönderildi. Lütfen mail kutunuzu kontrol edin.')
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data ||
        'Bir hata oluştu. Lütfen email adresinizi kontrol edin.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 border border-orange-primary/30 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-orange-primary mb-6 text-center">
          Şifremi Unuttum
        </h1>
        <p className="text-gray-400 mb-6 text-center">
          Şifrenizi sıfırlamak için email adresinizi girin. Size şifre sıfırlama linki göndereceğiz.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Email Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
              required
              placeholder="ornek@email.com"
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
            {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
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

export default ForgotPassword

