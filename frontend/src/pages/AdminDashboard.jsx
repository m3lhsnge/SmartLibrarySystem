import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { booksAPI, categoriesAPI, usersAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import BookCard from '../components/BookCard'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('books')
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('book') // 'book', 'category', 'user'
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'books') {
        const res = await booksAPI.getAll()
        setBooks(res.data || [])
      } else if (activeTab === 'categories') {
        const res = await categoriesAPI.getAll()
        setCategories(res.data || [])
      } else if (activeTab === 'users') {
        const res = await usersAPI.getAll()
        setUsers(res.data || [])
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
    } finally {
      setLoading(false)
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
      loadData()
    } catch (error) {
      alert('Silme işlemi başarısız: ' + error.message)
    }
  }

  const handleEdit = (type, item) => {
    setModalType(type)
    setEditingItem(item)
    // Düzenleme için mevcut değerleri formState'e aktar
    if (type === 'category') {
      setFormData({
        name: item.name || '',
        description: item.description || '',
      })
    } else if (type === 'user') {
      setFormData({
        username: item.username || '',
        fullName: item.fullName || '',
        email: item.email || '',
        phone: item.phone || '',
        role: item.role || 'STUDENT',
        active: item.active ?? true,
      })
    } else if (type === 'book') {
      setFormData({
        title: item.title || '',
        isbn: item.isbn || '',
        publicationYear: item.publicationYear || '',
      })
    } else {
      setFormData({})
    }
    setShowModal(true)
  }

  const handleCreate = (type) => {
    setModalType(type)
    setEditingItem(null)
    // Yeni kayıt için boş form
    if (type === 'category') {
      setFormData({
        name: '',
        description: '',
      })
    } else if (type === 'user') {
      setFormData({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        role: 'STUDENT',
        password: '',
        active: true,
      })
    } else if (type === 'book') {
      setFormData({
        title: '',
        isbn: '',
        publicationYear: '',
      })
    } else {
      setFormData({})
    }
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      if (modalType === 'category') {
        if (editingItem) {
          await categoriesAPI.update(editingItem.categoryId, formData)
        } else {
          await categoriesAPI.create(formData)
        }
      } else if (modalType === 'user') {
        const payload = {
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          // Backend tarafında passwordHash bekleniyor, yeni user için basit bir alan kullanıyoruz
          passwordHash: formData.password || editingItem?.passwordHash || '',
          active: formData.active,
        }
        if (editingItem) {
          await usersAPI.update(editingItem.userId, payload)
        } else {
          await usersAPI.create(payload)
        }
      } else if (modalType === 'book') {
        if (editingItem) {
          await booksAPI.update(editingItem.bookId, formData)
        } else {
          await booksAPI.create(formData)
        }
      }
      setShowModal(false)
      setEditingItem(null)
      setFormData({})
      await loadData()
    } catch (error) {
      alert('Kaydetme işlemi başarısız: ' + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
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
              onClick={() => setActiveTab('books')}
              className={`relative px-6 py-4 font-bold text-sm tracking-wide transition-all duration-300 group ${
                activeTab === 'books'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h4a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h4a2 2 0 002-2v-2a2 2 0 00-2-2h-4z" />
                </svg>
                Kitaplar
              </span>
              {activeTab === 'books' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-lg"></div>
              )}
              {activeTab !== 'books' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 group-hover:bg-orange-500/50 transition-colors"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`relative px-6 py-4 font-bold text-sm tracking-wide transition-all duration-300 group ${
                activeTab === 'categories'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v3a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                </svg>
                Kategoriler
              </span>
              {activeTab === 'categories' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-lg"></div>
              )}
              {activeTab !== 'categories' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 group-hover:bg-orange-500/50 transition-colors"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`relative px-6 py-4 font-bold text-sm tracking-wide transition-all duration-300 group ${
                activeTab === 'users'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM16.6 12.08A6.002 6.002 0 009 2a6 6 0 00-6 6v.89l-.141.894A4 4 0 007 16h6a4 4 0 003.878-5.12z" />
                </svg>
                Kullanıcılar
              </span>
              {activeTab === 'users' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-lg"></div>
              )}
              {activeTab !== 'users' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 group-hover:bg-orange-500/50 transition-colors"></div>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="px-8 py-6 bg-black">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-primary">
            {activeTab === 'books' && 'Kitaplar'}
            {activeTab === 'categories' && 'Kategoriler'}
            {activeTab === 'users' && 'Kullanıcılar'}
          </h2>
          <button
            onClick={() =>
              handleCreate(
                activeTab === 'books'
                  ? 'book'
                  : activeTab === 'categories'
                  ? 'category'
                  : 'user'
              )
            }
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            + Yeni Ekle
          </button>
        </div>

        {loading ? (
          <div className="text-center text-orange-primary py-12">Yükleniyor...</div>
        ) : (
          <>
            {activeTab === 'books' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <div key={book.bookId} className="relative">
                    <BookCard book={book} />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleEdit('book', book)}
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
            )}

            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
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
                        onClick={() => handleEdit('category', category)}
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
            )}

            {activeTab === 'users' && (
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
                    {users.map((u) => (
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
                              onClick={() => handleEdit('user', u)}
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
            )}
          </>
        )}
      </main>

      {/* Modal - Basit bir form modal'ı eklenebilir */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-orange-primary/30 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-orange-primary mb-4">
              {editingItem ? 'Düzenle' : 'Yeni Ekle'}
            </h3>

            {/* Kategori Formu */}
            {modalType === 'category' && (
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Kategori Adı</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Açıklama</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                  />
                </div>
              </div>
            )}

            {/* Kullanıcı Formu */}
            {modalType === 'user' && (
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Kullanıcı Adı</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Telefon</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                    />
                  </div>
                  {!editingItem && (
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Şifre</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Rol</label>
                    <select
                      name="role"
                      value={formData.role || 'STUDENT'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="STUDENT">STUDENT</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="active"
                      type="checkbox"
                      name="active"
                      checked={!!formData.active}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-primary focus:ring-orange-primary border-gray-700 bg-gray-800"
                    />
                    <label htmlFor="active" className="text-sm text-gray-300">
                      Aktif
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Kitap Formu (Basitleştirilmiş) */}
            {modalType === 'book' && (
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Kitap Adı</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Basım Yılı</label>
                  <input
                    type="number"
                    name="publicationYear"
                    value={formData.publicationYear || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-primary"
                  />
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-orange-primary hover:bg-orange-dark disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

