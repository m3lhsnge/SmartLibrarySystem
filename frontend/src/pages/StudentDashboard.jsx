import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { booksAPI, borrowingsAPI, penaltiesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import BookCard from '../components/BookCard'
import Sidebar from '../components/Sidebar'
import { categoriesAPI } from '../services/api'

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('borrow')
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [myBorrowings, setMyBorrowings] = useState([])
  const [myPenalties, setMyPenalties] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, activeTab])

  useEffect(() => {
    if (selectedCategory && activeTab === 'borrow') {
      loadBooksByCategory(selectedCategory.categoryId)
    }
  }, [selectedCategory, activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'borrow') {
        const [booksRes, categoriesRes] = await Promise.all([
          booksAPI.getAll(),
          categoriesAPI.getAll(),
        ])
        setBooks(booksRes.data || [])
        setCategories(categoriesRes.data || [])
      } else if (activeTab === 'my-books') {
        const res = await borrowingsAPI.getByUser(user.userId)
        setMyBorrowings(res.data || [])
      } else if (activeTab === 'penalties') {
        const res = await penaltiesAPI.getByUser(user.userId)
        setMyPenalties(res.data || [])
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBooksByCategory = async (categoryId) => {
    try {
      const allBooksRes = await booksAPI.getAll()
      const allBooks = allBooksRes.data || []
      const filtered = allBooks.filter(
        (book) => book.category?.categoryId === categoryId
      )
      setBooks(filtered)
    } catch (error) {
      console.error('Kitaplar yüklenirken hata:', error)
    }
  }

  const handleBorrow = async (bookId) => {
    if (!user) return

    try {
      await borrowingsAPI.borrow(user.userId, bookId)
      alert('Kitap başarıyla ödünç alındı!')
      if (activeTab === 'my-books') {
        loadData()
      }
    } catch (error) {
      alert('Ödünç alma başarısız: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleReturn = async (borrowingId) => {
    if (!window.confirm('Kitabı iade etmek istediğinize emin misiniz?')) return

    try {
      await borrowingsAPI.return(borrowingId)
      alert('Kitap başarıyla iade edildi!')
      loadData()
    } catch (error) {
      alert('İade işlemi başarısız: ' + (error.response?.data?.message || error.message))
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-gray-950 to-black border-b border-orange-primary/30">
        <div className="px-8 py-6 flex justify-between items-center">
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
              onClick={() => navigate('/profile')}
              className="text-white hover:text-orange-primary font-semibold cursor-pointer transition-colors duration-300"
            >
              {user?.fullName || user?.username}
            </button>
            <button
              onClick={() => navigate('/home')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Ana Sayfa
            </button>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="bg-gradient-to-r from-gray-950 via-black to-gray-950 border-b border-orange-500/30 sticky top-0 z-10">
        <div className="px-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('borrow')}
              className={`relative px-6 py-4 font-bold text-sm tracking-wide transition-all duration-300 group ${
                activeTab === 'borrow'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h4a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h4a2 2 0 002-2v-2a2 2 0 00-2-2h-4z" />
                </svg>
                Kitap Ödünç Al
              </span>
              {activeTab === 'borrow' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-lg"></div>
              )}
              {activeTab !== 'borrow' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 group-hover:bg-orange-500/50 transition-colors"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('my-books')}
              className={`relative px-6 py-4 font-bold text-sm tracking-wide transition-all duration-300 group ${
                activeTab === 'my-books'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 4a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 11-2 0V5H3a1 1 0 01-1-1zm8-1a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1z" />
                </svg>
                Kitaplarım
              </span>
              {activeTab === 'my-books' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-lg"></div>
              )}
              {activeTab !== 'my-books' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 group-hover:bg-orange-500/50 transition-colors"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('penalties')}
              className={`relative px-6 py-4 font-bold text-sm tracking-wide transition-all duration-300 group ${
                activeTab === 'penalties'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011-1h8a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V2zm3 4a1 1 0 000 2h2a1 1 0 100-2H8z" clipRule="evenodd" />
                </svg>
                Cezalarım
              </span>
              {activeTab === 'penalties' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-lg"></div>
              )}
              {activeTab !== 'penalties' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 group-hover:bg-orange-500/50 transition-colors"></div>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Sadece ödünç alma sayfasında göster */}
        {activeTab === 'borrow' && (
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 px-8 py-6 bg-black">
          {loading ? (
            <div className="text-center text-orange-primary py-12">Yükleniyor...</div>
          ) : (
            <>
              {activeTab === 'borrow' && (
                <div>
                  <h2 className="text-2xl font-bold text-orange-primary mb-6">
                    {selectedCategory
                      ? `${selectedCategory.name} Kategorisi (${books.length} kitap)`
                      : 'Tüm Kitaplar'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                      <BookCard
                        key={book.bookId}
                        book={book}
                        onBorrow={handleBorrow}
                        showBorrowButton={true}
                        userId={user?.userId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'my-books' && (
                <div>
                  <h2 className="text-2xl font-bold text-orange-primary mb-6">Ödünç Aldığım Kitaplar</h2>
                  <div className="space-y-4">
                    {myBorrowings.length === 0 ? (
                      <div className="text-center text-gray-400 py-12">
                        Henüz ödünç aldığınız kitap yok.
                      </div>
                    ) : (
                      myBorrowings.map((borrowing) => (
                        <div
                        key={borrowing.borrowingId}
                        className={`bg-gray-900 border border-orange-primary/20 p-4 rounded-lg ${
                          isOverdue(borrowing.dueDate) && borrowing.returnDate === null
                            ? 'border-2 border-red-500'
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">
                              {borrowing.book?.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              Yazar: {borrowing.book?.authors?.map((a) => a.name).join(', ')}
                            </p>
                            <div className="mt-2 text-sm text-gray-400">
                                <p>Ödünç Tarihi: {formatDate(borrowing.borrowDate)}</p>
                                <p
                                  className={
                                    isOverdue(borrowing.dueDate) && borrowing.returnDate === null
                                      ? 'text-red-400 font-bold'
                                      : ''
                                  }
                                >
                                  İade Tarihi: {formatDate(borrowing.dueDate)}
                                </p>
                                {borrowing.returnDate && (
                                  <p className="text-green-400">
                                    İade Edildi: {formatDate(borrowing.returnDate)}
                                  </p>
                                )}
                                {isOverdue(borrowing.dueDate) && borrowing.returnDate === null && (
                                  <p className="text-red-400 font-bold mt-2">
                                    ⚠️ İade tarihi geçmiş!
                                  </p>
                                )}
                              </div>
                            </div>
                            {borrowing.returnDate === null && (
                              <button
                                onClick={() => handleReturn(borrowing.borrowingId)}
                                className="bg-orange-primary hover:bg-orange-dark text-white px-4 py-2 rounded ml-4 transition-colors"
                              >
                                İade Et
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'penalties' && (
                <div>
                  <h2 className="text-2xl font-bold text-orange-primary mb-6">Cezalarım</h2>
                  <div className="space-y-4">
                    {myPenalties.length === 0 ? (
                      <div className="text-center text-gray-400 py-12">
                        Henüz cezanız bulunmuyor.
                      </div>
                    ) : (
                      myPenalties.map((penalty) => (
                        <div
                          key={penalty.penaltyId}
                          className="bg-gray-900 border border-red-500/30 p-4 rounded-lg border-l-4 border-red-500"
                        >
                          <h3 className="text-lg font-bold text-white">
                            {penalty.borrowing?.book?.title}
                          </h3>
                          <div className="mt-2 text-sm text-gray-400">
                            <p>Ceza Miktarı: {penalty.amount} TL</p>
                            <p>Oluşturulma Tarihi: {formatDate(penalty.createdAt)}</p>
                            <p className="text-red-400 mt-2">
                              Durum: {penalty.paid ? 'Ödendi' : 'Ödenmedi'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default StudentDashboard

