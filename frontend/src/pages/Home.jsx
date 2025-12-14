import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { booksAPI, categoriesAPI, borrowingsAPI, penaltiesAPI, usersAPI, authorsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import BookCard from '../components/BookCard'

const Home = () => {
  const [latestBooks, setLatestBooks] = useState([])
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Student için
  const [activeTab, setActiveTab] = useState('home')
  const [myBorrowings, setMyBorrowings] = useState([])
  const [myPenalties, setMyPenalties] = useState([])
  const [allBooks, setAllBooks] = useState([])
  
  // Admin için
  const [adminTab, setAdminTab] = useState('home')
  const [adminBooks, setAdminBooks] = useState([])
  const [adminCategories, setAdminCategories] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [adminAuthors, setAdminAuthors] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('book')
  const [editingItem, setEditingItem] = useState(null)
  const [bookForm, setBookForm] = useState({
    title: '',
    isbn: '',
    imageUrl: '',
    category: null,
    authors: [],
    publicationYear: '',
    publisher: '',
    language: 'Türkçe',
    pageCount: '',
    totalCopies: 10,
    availableCopies: 10,
    isFeatured: false,
    shelfLocation: '',
    description: ''
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeBorrowedBookIds, setActiveBorrowedBookIds] = useState([])
  const [allBooksForSearch, setAllBooksForSearch] = useState([])
  
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadInitialData()
    loadAllBooksForSearch()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      loadBooksByCategory(selectedCategory.categoryId)
    }
    // selectedCategory null olduğunda filteredBooks'u temizleme
    // "Tümü" butonuna tıklanırsa filteredBooks zaten set edilmiş olacak
    // Ana sayfaya dönmek için başka bir kategori seçilmeli veya sayfa yenilenmeli
  }, [selectedCategory])

  useEffect(() => {
    if (user) {
      if (user.role === 'STUDENT' && activeTab !== 'home') {
        loadStudentData()
      } else if (user.role === 'ADMIN' && adminTab && adminTab !== 'home') {
        loadAdminData()
      }
      // Aktif ödünçleri yükle
      loadActiveBorrowings()
      // Cezaları yükle (her zaman güncel olsun)
      if (user.role === 'STUDENT') {
        loadPenalties()
      }
    }
  }, [user, activeTab, adminTab])

  // Aktif ödünçleri yükle (iade edilmemiş kitaplar)
  const loadActiveBorrowings = async () => {
    if (!user) return
    try {
      const res = await borrowingsAPI.getByUser(user.userId)
      const activeBorrowings = (res.data || []).filter(
        (b) => b.returnDate === null
      )
      setActiveBorrowedBookIds(activeBorrowings.map((b) => b.book?.bookId))
    } catch (error) {
      console.error('Aktif ödünçler yüklenirken hata:', error)
    }
  }

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [latestRes, featuredRes, categoriesRes] = await Promise.all([
        booksAPI.getLatest(),
        booksAPI.getFeatured(),
        categoriesAPI.getAll(),
      ])
      setLatestBooks(latestRes.data || [])
      setFeaturedBooks(featuredRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAllBooksForSearch = async () => {
    try {
      const res = await booksAPI.getAll()
      setAllBooksForSearch(res.data || [])
    } catch (error) {
      console.error('Tüm kitaplar yüklenirken hata:', error)
    }
  }

  const loadBooksByCategory = async (categoryId) => {
    try {
      const allBooksRes = await booksAPI.getAll()
      const allBooks = allBooksRes.data || []
      const filtered = allBooks.filter(
        (book) => book.category?.categoryId === categoryId
      )
      setFilteredBooks(filtered)
    } catch (error) {
      console.error('Kitaplar yüklenirken hata:', error)
    }
  }

  const loadStudentData = async () => {
    try {
      if (activeTab === 'my-books') {
        const res = await borrowingsAPI.getByUser(user.userId)
        setMyBorrowings(res.data || [])
      } else if (activeTab === 'penalties') {
        const res = await penaltiesAPI.getByUser(user.userId)
        setMyPenalties(res.data || [])
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
    }
  }

  const loadPenalties = async () => {
    if (!user) return
    try {
      const res = await penaltiesAPI.getByUser(user.userId)
      setMyPenalties(res.data || [])
    } catch (error) {
      console.error('Cezalar yüklenirken hata:', error)
    }
  }

  const loadAdminData = async () => {
    try {
      if (adminTab === 'books') {
        const [booksRes, categoriesRes, authorsRes] = await Promise.all([
          booksAPI.getAll(),
          categoriesAPI.getAll(),
          authorsAPI.getAll()
        ])
        setAdminBooks(booksRes.data || [])
        setAdminCategories(categoriesRes.data || [])
        setAdminAuthors(authorsRes.data || [])
      } else if (adminTab === 'categories') {
        const res = await categoriesAPI.getAll()
        setAdminCategories(res.data || [])
      } else if (adminTab === 'users') {
        const res = await usersAPI.getAll()
        setAdminUsers(res.data || [])
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
    }
  }

  const handleBorrow = async (bookId) => {
    if (!user) {
      navigate('/login')
      return
    }

    // Eğer kitap zaten ödünçteyse uyar
    if (activeBorrowedBookIds.includes(bookId)) {
      alert('Bu kitabı zaten ödünç aldınız!')
      return
    }

    try {
      await borrowingsAPI.borrow(user.userId, bookId)
      alert('Kitap başarıyla ödünç alındı!')
      
      // Tüm ilgili verileri yeniden yükle
      loadInitialData() // Ana sayfadaki kitapları güncelle
      loadActiveBorrowings() // Aktif ödünçleri güncelle
      loadAllBooksForSearch() // Arama için tüm kitapları güncelle
      
      if (user.role === 'STUDENT') {
        if (activeTab === 'my-books') {
          loadStudentData() // "Kitaplarım" tab'ını güncelle
        }
      }
      
      // Kategori seçiliyse, o kategorideki kitapları da güncelle
      if (selectedCategory) {
        loadBooksByCategory(selectedCategory.categoryId)
      }
    } catch (error) {
      alert('Ödünç alma başarısız: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleReturn = async (borrowingId) => {
    if (!window.confirm('Kitabı iade etmek istediğinize emin misiniz?')) return

    try {
      const response = await borrowingsAPI.return(borrowingId)
      const returnedBorrowing = response.data
      
      // İade tarihi geçmiş mi kontrol et
      const isOverdue = returnedBorrowing.dueDate && 
                        new Date(returnedBorrowing.dueDate) < new Date(returnedBorrowing.returnDate)
      
      if (isOverdue) {
        alert('Kitap başarıyla iade edildi! Geç iade nedeniyle ceza hesaplandı. Cezalarım bölümünden kontrol edebilirsiniz.')
      } else {
        alert('Kitap başarıyla iade edildi!')
      }
      
      // Sadece ilgili borrowing'i güncelle, tüm listeyi yeniden yükleme
      setMyBorrowings(prevBorrowings => 
        prevBorrowings.map(b => 
          b.borrowingId === borrowingId 
            ? { ...b, returnDate: returnedBorrowing.returnDate }
            : b
        )
      )
      
      // Aktif ödünçlerden çıkar
      if (returnedBorrowing.book?.bookId) {
        setActiveBorrowedBookIds(prev => 
          prev.filter(id => id !== returnedBorrowing.book.bookId)
        )
      }
      
      // Cezaları yeniden yükle (geç iade durumunda yeni ceza oluşmuş olabilir)
      if (user) {
        loadPenalties()
      }
      
      // Tüm ilgili verileri yeniden yükle (stok güncellemesi için)
      loadInitialData() // Ana sayfadaki kitapları güncelle (stok artışı için)
      loadAllBooksForSearch() // Arama için tüm kitapları güncelle
      
      // Kategori seçiliyse, o kategorideki kitapları da güncelle
      if (selectedCategory) {
        loadBooksByCategory(selectedCategory.categoryId)
      }
      
      // Eğer "Kitaplarım" tab'ındaysak verileri yeniden yükle
      if (user && user.role === 'STUDENT' && activeTab === 'my-books') {
        loadStudentData()
      }
    } catch (error) {
      alert('İade işlemi başarısız: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleBookSubmit = async (e) => {
    e.preventDefault()
    
    if (bookForm.authors.length === 0) {
      alert('En az bir yazar seçmelisiniz!')
      return
    }

    if (!bookForm.category) {
      alert('Bir kategori seçmelisiniz!')
      return
    }

    try {
      const bookData = {
        title: bookForm.title,
        isbn: bookForm.isbn,
        imageUrl: bookForm.imageUrl || null,
        category: bookForm.category,
        authors: bookForm.authors.map(a => ({ authorId: a.authorId })),
        publicationYear: bookForm.publicationYear ? parseInt(bookForm.publicationYear) : null,
        publisher: bookForm.publisher || null,
        language: bookForm.language || 'Türkçe',
        pageCount: bookForm.pageCount ? parseInt(bookForm.pageCount) : null,
        totalCopies: bookForm.totalCopies || 10,
        availableCopies: bookForm.availableCopies || bookForm.totalCopies || 10,
        isFeatured: bookForm.isFeatured || false,
        shelfLocation: bookForm.shelfLocation || null,
        description: bookForm.description || null
      }

      if (editingItem) {
        await booksAPI.update(editingItem.bookId, bookData)
        alert('Kitap başarıyla güncellendi!')
      } else {
        await booksAPI.create(bookData)
        alert('Kitap başarıyla eklendi!')
      }

      setShowModal(false)
      loadAdminData()
      loadInitialData()
      loadAllBooksForSearch()
    } catch (error) {
      alert('İşlem başarısız: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return

    try {
      if (type === 'book') {
        await booksAPI.delete(id)
      } else if (type === 'category') {
        await categoriesAPI.delete(id)
      } else if (type === 'user') {
        await usersAPI.delete(id)
      }
      loadAdminData()
      loadInitialData()
      loadAllBooksForSearch()
    } catch (error) {
      alert('Silme işlemi başarısız: ' + error.message)
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

  // Arama fonksiyonları
  const filterBooksBySearch = (books) => {
    if (!searchQuery.trim()) return books
    
    const query = searchQuery.toLowerCase().trim()
    return books.filter((book) => {
      const title = book.title?.toLowerCase() || ''
      const authors = book.authors?.map(a => a.name?.toLowerCase() || '').join(' ') || ''
      const category = book.category?.name?.toLowerCase() || ''
      const isbn = book.isbn?.toLowerCase() || ''
      const publisher = book.publisher?.toLowerCase() || ''
      
      return (
        title.includes(query) ||
        authors.includes(query) ||
        category.includes(query) ||
        isbn.includes(query) ||
        publisher.includes(query)
      )
    })
  }

  const filterUsersBySearch = (users) => {
    if (!searchQuery.trim()) return users
    
    const query = searchQuery.toLowerCase().trim()
    return users.filter((u) => {
      const username = u.username?.toLowerCase() || ''
      const fullName = u.fullName?.toLowerCase() || ''
      const email = u.email?.toLowerCase() || ''
      const role = u.role?.toLowerCase() || ''
      
      return (
        username.includes(query) ||
        fullName.includes(query) ||
        email.includes(query) ||
        role.includes(query)
      )
    })
  }

  const filterCategoriesBySearch = (categories) => {
    if (!searchQuery.trim()) return categories
    
    const query = searchQuery.toLowerCase().trim()
    return categories.filter((cat) => {
      const name = cat.name?.toLowerCase() || ''
      const description = cat.description?.toLowerCase() || ''
      
      return (
        name.includes(query) ||
        description.includes(query)
      )
    })
  }

  // Arama placeholder'ını belirle
  const getSearchPlaceholder = () => {
    if (!user) {
      return "Kitap adı, yazar, kategori, ISBN veya yayınevi ile ara..."
    }
    if (user.role === 'STUDENT') {
      return "Kitap adı, yazar, kategori, ISBN veya yayınevi ile ara..."
    }
    if (user.role === 'ADMIN') {
      if (adminTab === 'books') {
        return "Kitap adı, yazar, kategori, ISBN veya yayınevi ile ara..."
      }
      if (adminTab === 'users') {
        return "Kullanıcı adı, ad soyad, email veya rol ile ara..."
      }
      if (adminTab === 'categories') {
        return "Kategori adı veya açıklama ile ara..."
      }
      return "Kitap adı, yazar, kategori, ISBN veya yayınevi ile ara..."
    }
    return "Ara..."
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-orange-primary text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-gray-950 to-black border-b border-orange-primary/30">
        <div className="container mx-auto px-8 py-5 flex justify-between items-center">
          <button
            onClick={() => {
              setActiveTab('home')
              setAdminTab('home')
              setSelectedCategory(null)
              setFilteredBooks([])
            }}
            className="flex flex-col text-left hover:opacity-80 transition-opacity gap-1"
          >
            <h1 className="text-4xl font-black text-white">Akıllı Kütüphane Sistemi</h1>
            <span className="text-sm font-medium text-gray-400 hover:text-orange-primary/70 transition-colors duration-300">Made by m3lhsnge</span>
          </button>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-white hover:text-orange-primary font-semibold cursor-pointer transition-colors duration-300"
                >
                  {user.fullName || user.username}
                </button>
                <button
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Kayıt Ol
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-orange-primary hover:bg-orange-dark text-white px-4 py-2 rounded transition-colors"
                >
                  Giriş Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Arama Barı */}
      <div className="bg-black border-b border-orange-primary/20 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-orange-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-primary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Sadece giriş yapmış kullanıcılar için */}
      {user && (
        <div className="bg-black border-b border-orange-primary/20">
          <div className="container mx-auto px-4">
            <div className="flex gap-4">
              {user.role === 'STUDENT' ? (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('home')
                      setSelectedCategory(null)
                      setFilteredBooks([])
                      setSearchQuery('')
                    }}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === 'home'
                        ? 'bg-orange-primary text-white'
                        : 'text-gray-400 hover:text-orange-primary hover:bg-gray-900'
                    }`}
                  >
                    Ana Sayfa
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('my-books')
                      loadStudentData()
                    }}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === 'my-books'
                        ? 'bg-orange-primary text-white'
                        : 'text-gray-400 hover:text-orange-primary hover:bg-gray-900'
                    }`}
                  >
                    Kitaplarım
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('penalties')
                      loadStudentData()
                    }}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === 'penalties'
                        ? 'bg-orange-primary text-white'
                        : 'text-gray-400 hover:text-orange-primary hover:bg-gray-900'
                    }`}
                  >
                    Cezalarım
                  </button>
                </>
              ) : user.role === 'ADMIN' ? (
                <>
                  <button
                    onClick={() => {
                      setAdminTab('home')
                      setSelectedCategory(null)
                      setFilteredBooks([])
                    }}
                    className={`px-6 py-3 font-medium transition-colors ${
                      adminTab === 'home'
                        ? 'bg-orange-primary text-white'
                        : 'text-gray-400 hover:text-orange-primary hover:bg-gray-900'
                    }`}
                  >
                    Ana Sayfa
                  </button>
                  <button
                    onClick={() => {
                      setAdminTab('books')
                      setSelectedCategory(null)
                      setFilteredBooks([])
                      setSearchQuery('')
                      loadAdminData()
                    }}
                    className={`px-6 py-3 font-medium transition-colors ${
                      adminTab === 'books'
                        ? 'bg-orange-primary text-white'
                        : 'text-gray-400 hover:text-orange-primary hover:bg-gray-900'
                    }`}
                  >
                    Kitaplar
                  </button>
                  <button
                    onClick={() => {
                      setAdminTab('categories')
                      setSelectedCategory(null)
                      setFilteredBooks([])
                      setSearchQuery('')
                      loadAdminData()
                    }}
                    className={`px-6 py-3 font-medium transition-colors ${
                      adminTab === 'categories'
                        ? 'bg-orange-primary text-white'
                        : 'text-gray-400 hover:text-orange-primary hover:bg-gray-900'
                    }`}
                  >
                    Kategoriler
                  </button>
                  <button
                    onClick={() => {
                      setAdminTab('users')
                      setSelectedCategory(null)
                      setFilteredBooks([])
                      setSearchQuery('')
                      loadAdminData()
                    }}
                    className={`px-6 py-3 font-medium transition-colors ${
                      adminTab === 'users'
                        ? 'bg-orange-primary text-white'
                        : 'text-gray-400 hover:text-orange-primary hover:bg-gray-900'
                    }`}
                  >
                    Kullanıcılar
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar - Her zaman göster, sadece açık/kapalı durumunu kontrol et */}
        {((!user || (user.role === 'STUDENT' && activeTab === 'home') || (user.role === 'ADMIN' && adminTab === 'home'))) && (
          <>
            {/* Sidebar Toggle Button */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 bg-orange-primary hover:bg-orange-dark text-white p-2 rounded-r-lg shadow-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            {/* Sidebar */}
            <div
              className={`bg-black border-r border-orange-primary/20 transition-all duration-300 overflow-hidden ${
                sidebarOpen ? 'w-64' : 'w-0'
              }`}
            >
              {sidebarOpen && (
                <div className="p-4 h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-orange-primary">Kategoriler</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="text-orange-primary hover:text-orange-secondary transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={async () => {
                        setSelectedCategory(null)
                        setSearchQuery('')
                        // Tüm kitapları yükle ve göster
                        try {
                          const res = await booksAPI.getAll()
                          const allBooks = res.data || []
                          setAllBooksForSearch(allBooks)
                          setFilteredBooks(allBooks)
                        } catch (error) {
                          console.error('Tüm kitaplar yüklenirken hata:', error)
                        }
                      }}
                      className={`w-full text-left px-4 py-2 rounded transition-colors ${
                        selectedCategory === null && filteredBooks.length > 0
                          ? 'bg-orange-primary text-white'
                          : 'bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-orange-primary border border-orange-primary/20'
                      }`}
                    >
                      Tümü
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.categoryId}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-2 rounded transition-colors ${
                          selectedCategory?.categoryId === category.categoryId
                            ? 'bg-orange-primary text-white'
                            : 'bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-orange-primary border border-orange-primary/20'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 bg-black">
          {/* Arama sonuçları - Ana Sayfa (Kitap araması) */}
          {searchQuery.trim() && !selectedCategory && ((!user || (user.role === 'STUDENT' && activeTab === 'home') || (user.role === 'ADMIN' && adminTab === 'home'))) ? (
            <div>
              <h2 className="text-2xl font-bold text-orange-primary mb-6">
                Arama Sonuçları: "{searchQuery}" ({filterBooksBySearch(allBooksForSearch).length} kitap bulundu)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {filterBooksBySearch(allBooksForSearch).map((book) => (
                  user?.role === 'ADMIN' ? (
                    <div key={book.bookId} className="relative">
                      <BookCard book={book} />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={async () => {
                            setModalType('book')
                            setEditingItem(book)
                            setBookForm({
                              title: book.title || '',
                              isbn: book.isbn || '',
                              imageUrl: book.imageUrl || '',
                              category: book.category || null,
                              authors: book.authors || [],
                              publicationYear: book.publicationYear || '',
                              publisher: book.publisher || '',
                              language: book.language || 'Türkçe',
                              pageCount: book.pageCount || '',
                              totalCopies: book.totalCopies || 10,
                              availableCopies: book.availableCopies || 10,
                              isFeatured: book.isFeatured || false,
                              shelfLocation: book.shelfLocation || '',
                              description: book.description || ''
                            })
                            // Kategoriler ve yazarları yükle
                            try {
                              const [categoriesRes, authorsRes] = await Promise.all([
                                categoriesAPI.getAll(),
                                authorsAPI.getAll()
                              ])
                              setAdminCategories(categoriesRes.data || [])
                              setAdminAuthors(authorsRes.data || [])
                            } catch (error) {
                              console.error('Veri yüklenirken hata:', error)
                            }
                            setShowModal(true)
                          }}
                          className="flex-1 bg-orange-primary hover:bg-orange-dark text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete('book', book.bookId)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ) : (
                    <BookCard
                      key={book.bookId}
                      book={book}
                      onBorrow={handleBorrow}
                      showBorrowButton={!!user && user.role !== 'ADMIN'}
                      userId={user?.userId}
                      isBorrowed={activeBorrowedBookIds.includes(book.bookId)}
                    />
                  )
                ))}
              </div>
            </div>
          ) : ((!user || (user.role === 'STUDENT' && activeTab === 'home') || (user.role === 'ADMIN' && adminTab === 'home')) && !selectedCategory && filteredBooks.length === 0) ? (
            <>
              {/* Son Eklenen 5 Kitap */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-orange-primary mb-6 flex items-center gap-2">
                  <span className="text-4xl">📖</span>
                  Son Eklenen Kitaplar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {latestBooks.slice(0, 5).map((book) => (
                    user?.role === 'ADMIN' ? (
                      <div key={book.bookId} className="relative">
                        <BookCard book={book} />
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={async () => {
                              setModalType('book')
                              setEditingItem(book)
                              setBookForm({
                                title: book.title || '',
                                isbn: book.isbn || '',
                                imageUrl: book.imageUrl || '',
                                category: book.category || null,
                                authors: book.authors || [],
                                publicationYear: book.publicationYear || '',
                                publisher: book.publisher || '',
                                language: book.language || 'Türkçe',
                                pageCount: book.pageCount || '',
                                totalCopies: book.totalCopies || 10,
                                availableCopies: book.availableCopies || 10,
                                isFeatured: book.isFeatured || false,
                                shelfLocation: book.shelfLocation || '',
                                description: book.description || ''
                              })
                              // Kategoriler ve yazarları yükle
                              try {
                                const [categoriesRes, authorsRes] = await Promise.all([
                                  categoriesAPI.getAll(),
                                  authorsAPI.getAll()
                                ])
                                setAdminCategories(categoriesRes.data || [])
                                setAdminAuthors(authorsRes.data || [])
                              } catch (error) {
                                console.error('Veri yüklenirken hata:', error)
                              }
                              setShowModal(true)
                            }}
                            className="flex-1 bg-orange-primary hover:bg-orange-dark text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete('book', book.bookId)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ) : (
                      <BookCard
                        key={book.bookId}
                        book={book}
                        onBorrow={handleBorrow}
                        showBorrowButton={!!user && user.role !== 'ADMIN'}
                        userId={user?.userId}
                        isBorrowed={activeBorrowedBookIds.includes(book.bookId)}
                      />
                    )
                  ))}
                </div>
              </section>

              {/* Editör Tavsiyesi 10 Kitap */}
              <section>
                <h2 className="text-3xl font-bold text-orange-primary mb-6 flex items-center gap-2">
                  <span className="text-4xl">⭐</span>
                  Editörün Tavsiyesi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {featuredBooks.slice(0, 10).map((book) => (
                    user?.role === 'ADMIN' ? (
                      <div key={book.bookId} className="relative">
                        <BookCard book={book} />
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={async () => {
                              setModalType('book')
                              setEditingItem(book)
                              setBookForm({
                                title: book.title || '',
                                isbn: book.isbn || '',
                                imageUrl: book.imageUrl || '',
                                category: book.category || null,
                                authors: book.authors || [],
                                publicationYear: book.publicationYear || '',
                                publisher: book.publisher || '',
                                language: book.language || 'Türkçe',
                                pageCount: book.pageCount || '',
                                totalCopies: book.totalCopies || 10,
                                availableCopies: book.availableCopies || 10,
                                isFeatured: book.isFeatured || false,
                                shelfLocation: book.shelfLocation || '',
                                description: book.description || ''
                              })
                              // Kategoriler ve yazarları yükle
                              try {
                                const [categoriesRes, authorsRes] = await Promise.all([
                                  categoriesAPI.getAll(),
                                  authorsAPI.getAll()
                                ])
                                setAdminCategories(categoriesRes.data || [])
                                setAdminAuthors(authorsRes.data || [])
                              } catch (error) {
                                console.error('Veri yüklenirken hata:', error)
                              }
                              setShowModal(true)
                            }}
                            className="flex-1 bg-orange-primary hover:bg-orange-dark text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete('book', book.bookId)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ) : (
                      <BookCard
                        key={book.bookId}
                        book={book}
                        onBorrow={handleBorrow}
                        showBorrowButton={!!user && user.role !== 'ADMIN'}
                        userId={user?.userId}
                        isBorrowed={activeBorrowedBookIds.includes(book.bookId)}
                      />
                    )
                  ))}
                </div>
              </section>
            </>
          ) : selectedCategory === null && filteredBooks.length > 0 ? (
            // "Tümü" seçildiğinde - Tüm kitaplar
            <div>
              <h2 className="text-2xl font-bold text-orange-primary mb-6">
                Tüm Kitaplar ({filterBooksBySearch(filteredBooks).length} kitap)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {filterBooksBySearch(filteredBooks).map((book) => (
                  user?.role === 'ADMIN' ? (
                    <div key={book.bookId} className="relative">
                      <BookCard book={book} />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={async () => {
                            setModalType('book')
                            setEditingItem(book)
                            setBookForm({
                              title: book.title || '',
                              isbn: book.isbn || '',
                              imageUrl: book.imageUrl || '',
                              category: book.category || null,
                              authors: book.authors || [],
                              publicationYear: book.publicationYear || '',
                              publisher: book.publisher || '',
                              language: book.language || 'Türkçe',
                              pageCount: book.pageCount || '',
                              totalCopies: book.totalCopies || 10,
                              availableCopies: book.availableCopies || 10,
                              isFeatured: book.isFeatured || false,
                              shelfLocation: book.shelfLocation || '',
                              description: book.description || ''
                            })
                            // Kategoriler ve yazarları yükle
                            try {
                              const [categoriesRes, authorsRes] = await Promise.all([
                                categoriesAPI.getAll(),
                                authorsAPI.getAll()
                              ])
                              setAdminCategories(categoriesRes.data || [])
                              setAdminAuthors(authorsRes.data || [])
                            } catch (error) {
                              console.error('Veri yüklenirken hata:', error)
                            }
                            setShowModal(true)
                          }}
                          className="flex-1 bg-orange-primary hover:bg-orange-dark text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete('book', book.bookId)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ) : (
                    <BookCard
                      key={book.bookId}
                      book={book}
                      onBorrow={handleBorrow}
                      showBorrowButton={!!user && user.role !== 'ADMIN'}
                      userId={user?.userId}
                      isBorrowed={activeBorrowedBookIds.includes(book.bookId)}
                    />
                  )
                ))}
              </div>
            </div>
          ) : selectedCategory ? (
            // Kategori seçildiğinde
            <div>
              <h2 className="text-2xl font-bold text-orange-primary mb-6">
                {selectedCategory.name} Kategorisi ({filterBooksBySearch(filteredBooks).length} kitap)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {filterBooksBySearch(filteredBooks).map((book) => (
                  user?.role === 'ADMIN' ? (
                    <div key={book.bookId} className="relative">
                      <BookCard book={book} />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={async () => {
                            setModalType('book')
                            setEditingItem(book)
                            setBookForm({
                              title: book.title || '',
                              isbn: book.isbn || '',
                              imageUrl: book.imageUrl || '',
                              category: book.category || null,
                              authors: book.authors || [],
                              publicationYear: book.publicationYear || '',
                              publisher: book.publisher || '',
                              language: book.language || 'Türkçe',
                              pageCount: book.pageCount || '',
                              totalCopies: book.totalCopies || 10,
                              availableCopies: book.availableCopies || 10,
                              isFeatured: book.isFeatured || false,
                              shelfLocation: book.shelfLocation || '',
                              description: book.description || ''
                            })
                            // Kategoriler ve yazarları yükle
                            try {
                              const [categoriesRes, authorsRes] = await Promise.all([
                                categoriesAPI.getAll(),
                                authorsAPI.getAll()
                              ])
                              setAdminCategories(categoriesRes.data || [])
                              setAdminAuthors(authorsRes.data || [])
                            } catch (error) {
                              console.error('Veri yüklenirken hata:', error)
                            }
                            setShowModal(true)
                          }}
                          className="flex-1 bg-orange-primary hover:bg-orange-dark text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete('book', book.bookId)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ) : (
                    <BookCard
                      key={book.bookId}
                      book={book}
                      onBorrow={handleBorrow}
                      showBorrowButton={!!user && user.role !== 'ADMIN'}
                      userId={user?.userId}
                      isBorrowed={activeBorrowedBookIds.includes(book.bookId)}
                    />
                  )
                ))}
              </div>
            </div>
          ) : user?.role === 'STUDENT' && activeTab === 'my-books' ? (
            // Student - Kitaplarım
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
          ) : user?.role === 'STUDENT' && activeTab === 'penalties' ? (
            // Student - Cezalarım
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
          ) : user?.role === 'ADMIN' && adminTab === 'books' ? (
            // Admin - Kitaplar
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-primary">
                  {searchQuery.trim() 
                    ? `Arama Sonuçları: "${searchQuery}" (${filterBooksBySearch(adminBooks).length} kitap)` 
                    : 'Kitaplar'}
                </h2>
                  <button
                    onClick={async () => {
                      setModalType('book')
                      setEditingItem(null)
                      setBookForm({
                        title: '',
                        isbn: '',
                        imageUrl: '',
                        category: null,
                        authors: [],
                        publicationYear: '',
                        publisher: '',
                        language: 'Türkçe',
                        pageCount: '',
                        totalCopies: 10,
                        availableCopies: 10,
                        isFeatured: false,
                        shelfLocation: '',
                        description: ''
                      })
                      // Kategoriler ve yazarları yükle
                      try {
                        const [categoriesRes, authorsRes] = await Promise.all([
                          categoriesAPI.getAll(),
                          authorsAPI.getAll()
                        ])
                        setAdminCategories(categoriesRes.data || [])
                        setAdminAuthors(authorsRes.data || [])
                      } catch (error) {
                        console.error('Veri yüklenirken hata:', error)
                      }
                      setShowModal(true)
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    + Yeni Ekle
                  </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {filterBooksBySearch(adminBooks).map((book) => (
                  <div key={book.bookId} className="relative">
                    <BookCard book={book} />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={async () => {
                          setModalType('book')
                          setEditingItem(book)
                          setBookForm({
                            title: book.title || '',
                            isbn: book.isbn || '',
                            imageUrl: book.imageUrl || '',
                            category: book.category || null,
                            authors: book.authors || [],
                            publicationYear: book.publicationYear || '',
                            publisher: book.publisher || '',
                            language: book.language || 'Türkçe',
                            pageCount: book.pageCount || '',
                            totalCopies: book.totalCopies || 10,
                            availableCopies: book.availableCopies || 10,
                            isFeatured: book.isFeatured || false,
                            shelfLocation: book.shelfLocation || '',
                            description: book.description || ''
                          })
                          // Kategoriler ve yazarları yükle
                          try {
                            const [categoriesRes, authorsRes] = await Promise.all([
                              categoriesAPI.getAll(),
                              authorsAPI.getAll()
                            ])
                            setAdminCategories(categoriesRes.data || [])
                            setAdminAuthors(authorsRes.data || [])
                          } catch (error) {
                            console.error('Veri yüklenirken hata:', error)
                          }
                          setShowModal(true)
                        }}
                        className="flex-1 bg-orange-primary hover:bg-orange-dark text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete('book', book.bookId)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : user?.role === 'ADMIN' && adminTab === 'categories' ? (
            // Admin - Kategoriler
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-primary">
                  {searchQuery.trim() 
                    ? `Arama Sonuçları: "${searchQuery}" (${filterCategoriesBySearch(adminCategories).length} kategori)` 
                    : 'Kategoriler'}
                </h2>
                <button
                  onClick={() => {
                    setModalType('category')
                    setEditingItem(null)
                    setShowModal(true)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  + Yeni Ekle
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterCategoriesBySearch(adminCategories).map((category) => (
                  <div
                    key={category.categoryId}
                    className="bg-gray-900 border border-orange-primary/20 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-white">{category.name}</h3>
                      <p className="text-sm text-gray-400">{category.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setModalType('category')
                          setEditingItem(category)
                          setShowModal(true)
                        }}
                        className="bg-orange-primary hover:bg-orange-dark text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete('category', category.categoryId)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : user?.role === 'ADMIN' && adminTab === 'users' ? (
            // Admin - Kullanıcılar
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-primary">
                  {searchQuery.trim() 
                    ? `Arama Sonuçları: "${searchQuery}" (${filterUsersBySearch(adminUsers).length} kullanıcı)` 
                    : 'Kullanıcılar'}
                </h2>
                <button
                  onClick={() => {
                    setModalType('user')
                    setEditingItem(null)
                    setShowModal(true)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  + Yeni Ekle
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full bg-gray-900 border border-orange-primary/20 rounded-lg overflow-hidden">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-orange-primary">ID</th>
                      <th className="px-4 py-3 text-left text-orange-primary">Kullanıcı Adı</th>
                      <th className="px-4 py-3 text-left text-orange-primary">Ad Soyad</th>
                      <th className="px-4 py-3 text-left text-orange-primary">Email</th>
                      <th className="px-4 py-3 text-left text-orange-primary">Rol</th>
                      <th className="px-4 py-3 text-left text-orange-primary">Durum</th>
                      <th className="px-4 py-3 text-left text-orange-primary">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterUsersBySearch(adminUsers).map((u) => (
                      <tr key={u.userId} className="border-t border-gray-800">
                        <td className="px-4 py-3 text-white">{u.userId}</td>
                        <td className="px-4 py-3 text-white">{u.username}</td>
                        <td className="px-4 py-3 text-white">{u.fullName}</td>
                        <td className="px-4 py-3 text-white">{u.email}</td>
                        <td className="px-4 py-3 text-white">{u.role}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              u.active
                                ? 'bg-green-900 text-green-200'
                                : 'bg-red-900 text-red-200'
                            }`}
                          >
                            {u.active ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setModalType('user')
                                setEditingItem(u)
                                setShowModal(true)
                              }}
                              className="bg-orange-primary hover:bg-orange-dark text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDelete('user', u.userId)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 border border-orange-primary/30 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-orange-primary/30">
                  <h3 className="text-xl font-bold text-orange-primary">
                    {editingItem ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}
                  </h3>
                </div>
                <div className="overflow-y-auto p-6 flex-1">
                  {modalType === 'book' ? (
                    <form onSubmit={handleBookSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 mb-2">Kitap Adı *</label>
                          <input
                            type="text"
                            value={bookForm.title}
                            onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">ISBN *</label>
                          <input
                            type="text"
                            value={bookForm.isbn}
                            onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Kapak URL</label>
                          <input
                            type="url"
                            value={bookForm.imageUrl}
                            onChange={(e) => setBookForm({...bookForm, imageUrl: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                            placeholder="https://example.com/kitap-kapagi.jpg"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Kategori *</label>
                          <select
                            value={bookForm.category?.categoryId || ''}
                            onChange={(e) => {
                              const category = adminCategories.find(c => c.categoryId === parseInt(e.target.value))
                              setBookForm({...bookForm, category: category || null})
                            }}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                            required
                          >
                            <option value="">Kategori Seçin</option>
                            {adminCategories.map(cat => (
                              <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Yayın Yılı</label>
                          <input
                            type="number"
                            value={bookForm.publicationYear}
                            onChange={(e) => setBookForm({...bookForm, publicationYear: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                            min="1000"
                            max="2100"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Yayınevi</label>
                          <input
                            type="text"
                            value={bookForm.publisher}
                            onChange={(e) => setBookForm({...bookForm, publisher: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Dil</label>
                          <input
                            type="text"
                            value={bookForm.language}
                            onChange={(e) => setBookForm({...bookForm, language: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                            placeholder="Türkçe"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Sayfa Sayısı</label>
                          <input
                            type="number"
                            value={bookForm.pageCount}
                            onChange={(e) => setBookForm({...bookForm, pageCount: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Toplam Kopya</label>
                          <input
                            type="number"
                            value={bookForm.totalCopies}
                            onChange={(e) => setBookForm({...bookForm, totalCopies: parseInt(e.target.value) || 0, availableCopies: parseInt(e.target.value) || 0})}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                            min="1"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Mevcut Kopya</label>
                          <input
                            type="number"
                            value={bookForm.availableCopies}
                            onChange={(e) => setBookForm({...bookForm, availableCopies: parseInt(e.target.value) || 0})}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                            min="0"
                            max={bookForm.totalCopies}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Raf Konumu</label>
                          <input
                            type="text"
                            value={bookForm.shelfLocation}
                            onChange={(e) => setBookForm({...bookForm, shelfLocation: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                            placeholder="A-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={bookForm.isFeatured}
                            onChange={(e) => setBookForm({...bookForm, isFeatured: e.target.checked})}
                            className="w-5 h-5 text-orange-primary bg-gray-800 border-orange-primary/30 rounded focus:ring-orange-primary"
                          />
                          <label className="ml-2 text-gray-300">Editörün Seçimi</label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Yazarlar *</label>
                        <div className="max-h-40 overflow-y-auto border border-orange-primary/30 rounded p-2 bg-gray-800">
                          {adminAuthors.map(author => (
                            <label key={author.authorId} className="flex items-center mb-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={bookForm.authors.some(a => a.authorId === author.authorId)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setBookForm({...bookForm, authors: [...bookForm.authors, author]})
                                  } else {
                                    setBookForm({...bookForm, authors: bookForm.authors.filter(a => a.authorId !== author.authorId)})
                                  }
                                }}
                                className="w-4 h-4 text-orange-primary bg-gray-800 border-orange-primary/30 rounded focus:ring-orange-primary"
                              />
                              <span className="ml-2 text-white">{author.name}</span>
                            </label>
                          ))}
                        </div>
                        {bookForm.authors.length === 0 && (
                          <p className="text-red-400 text-sm mt-1">En az bir yazar seçmelisiniz</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Açıklama</label>
                        <textarea
                          value={bookForm.description}
                          onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-800 border border-orange-primary/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-primary"
                          rows="4"
                          placeholder="Kitap açıklaması..."
                        />
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-orange-primary/30">
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                        >
                          İptal
                        </button>
                        <button
                          type="submit"
                          disabled={bookForm.authors.length === 0}
                          className="flex-1 bg-orange-primary hover:bg-orange-dark text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {editingItem ? 'Güncelle' : 'Ekle'}
                        </button>
                      </div>
                    </form>
                  ) : modalType === 'category' ? (
                    <div>
                      <p className="text-gray-400 mb-4">Kategori formu buraya eklenecek</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowModal(false)}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                        >
                          İptal
                        </button>
                        <button
                          onClick={() => {
                            setShowModal(false)
                            loadAdminData()
                          }}
                          className="flex-1 bg-orange-primary hover:bg-orange-dark text-white px-4 py-2 rounded transition-colors"
                        >
                          Kaydet
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-400 mb-4">Kullanıcı formu buraya eklenecek</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowModal(false)}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                        >
                          İptal
                        </button>
                        <button
                          onClick={() => {
                            setShowModal(false)
                            loadAdminData()
                          }}
                          className="flex-1 bg-orange-primary hover:bg-orange-dark text-white px-4 py-2 rounded transition-colors"
                        >
                          Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home
