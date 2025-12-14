import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { usersAPI } from '../services/api'

const VerifyAccount = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      verifyToken()
    } else {
      setMessage('Geçersiz veya eksik doğrulama linki!')
      setLoading(false)
    }
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await usersAPI.verifyAccount(token)
      setMessage(response.data || 'Hesabınız başarıyla doğrulandı!')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.response?.data ||
        'Doğrulama işlemi başarısız! Link geçersiz veya süresi dolmuş olabilir.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 border border-orange-primary/30 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-orange-primary mb-6 text-center">
          Hesap Doğrulama
        </h1>
        {loading ? (
          <div className="text-center text-orange-primary">Doğrulanıyor...</div>
        ) : (
          <>
            <div
              className={`px-4 py-3 rounded mb-4 ${
                message.includes('BAŞARILI') || message.includes('başarıyla')
                  ? 'bg-green-900/50 border border-green-500 text-green-200'
                  : 'bg-red-900/50 border border-red-500 text-red-200'
              }`}
            >
              {message}
            </div>
            <div className="text-center">
              <Link
                to="/login"
                className="text-orange-primary hover:text-orange-secondary"
              >
                Giriş sayfasına git
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyAccount

