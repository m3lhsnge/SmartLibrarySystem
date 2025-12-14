import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usersAPI, borrowingsAPI } from '../services/api'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [totalBorrowings, setTotalBorrowings] = useState(0)
  const [activeBorrowings, setActiveBorrowings] = useState(0)

  useEffect(() => {
    if (user) {
      loadUserDetails()
      loadBorrowingStats()
    }
  }, [user])

  const loadUserDetails = async () => {
    try {
      setLoading(true)
      const res = await usersAPI.getByUsername(user.username)
      setUserDetails(res.data)
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBorrowingStats = async () => {
    try {
      const res = await borrowingsAPI.getByUser(user.userId)
      const allBorrowings = res.data || []
      setTotalBorrowings(allBorrowings.length)
      const active = allBorrowings.filter(b => b.returnDate === null).length
      setActiveBorrowings(active)
    } catch (error) {
      console.error('Ödünç istatistikleri yüklenirken hata:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-orange-primary">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-gray-950 to-black border-b border-orange-primary/30">
        <div className="container mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => navigate('/home')}
              className="text-4xl font-black text-white hover:text-orange-primary transition-colors duration-300 cursor-pointer text-left leading-tight"
            >
              Akıllı Kütüphane Sistemi
            </button>
            <span className="text-sm font-medium text-gray-400 hover:text-orange-primary/70 transition-colors duration-300">Made by m3lhsnge</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Ana Sayfa
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 border border-orange-primary/30 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-orange-primary mb-6 border-b border-orange-primary/30 pb-3">
              Kişisel Bilgiler
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400 font-medium">Kullanıcı Adı:</span>
                <span className="text-white font-semibold">{userDetails?.username || '-'}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400 font-medium">Ad Soyad:</span>
                <span className="text-white font-semibold">{userDetails?.fullName || '-'}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400 font-medium">Email:</span>
                <span className="text-white font-semibold">{userDetails?.email || '-'}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400 font-medium">Telefon:</span>
                <span className="text-white font-semibold">{userDetails?.phone || '-'}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400 font-medium">Rol:</span>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  userDetails?.role === 'ADMIN' 
                    ? 'bg-orange-primary text-white' 
                    : userDetails?.role === 'STAFF'
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-600 text-white'
                }`}>
                  {userDetails?.role === 'ADMIN' ? 'Yönetici' : 
                   userDetails?.role === 'STAFF' ? 'Personel' : 'Öğrenci'}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400 font-medium">Hesap Durumu:</span>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  userDetails?.active 
                    ? 'bg-green-600 text-white' 
                    : 'bg-red-600 text-white'
                }`}>
                  {userDetails?.active ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400 font-medium">Kayıt Tarihi:</span>
                <span className="text-white font-semibold">
                  {formatDate(userDetails?.registrationDate || userDetails?.createdAt)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-orange-primary/30">
              <h3 className="text-lg font-bold text-orange-primary mb-4">İstatistikler</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded p-4 border border-orange-primary/20">
                  <div className="text-gray-400 text-sm">Toplam Ödünç Alınan</div>
                  <div className="text-2xl font-bold text-orange-primary mt-2">{totalBorrowings}</div>
                </div>
                <div className="bg-gray-800 rounded p-4 border border-orange-primary/20">
                  <div className="text-gray-400 text-sm">Aktif Ödünçler</div>
                  <div className="text-2xl font-bold text-orange-primary mt-2">{activeBorrowings}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-red-500/30">
              <h3 className="text-lg font-bold text-red-400 mb-4">Tehlikeli Bölge</h3>
              <button
                onClick={async () => {
                  if (window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve hesabınız pasif duruma geçecektir.')) {
                    try {
                      await usersAPI.delete(user.userId)
                      alert('Hesabınız başarıyla silindi (pasif duruma geçirildi).')
                      logout()
                      navigate('/login')
                    } catch (error) {
                      alert('Hesap silme işlemi başarısız: ' + (error.response?.data?.message || error.message))
                    }
                  }
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors"
              >
                Hesabımı Sil (Pasif Yap)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile

