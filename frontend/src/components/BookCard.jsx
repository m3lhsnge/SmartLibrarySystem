import { useState } from 'react'

const BookCard = ({ book, onBorrow, showBorrowButton = false, userId = null, isBorrowed = false }) => {
  const [imageError, setImageError] = useState(false)

  const handleBorrow = () => {
    if (userId && onBorrow) {
      onBorrow(book.bookId, userId)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Resim URL'si - CORS-friendly sitelerden gelmeli
  const getImageUrl = () => {
    if (!book.imageUrl) return null
    return book.imageUrl
  }

  return (
    <div className="bg-gray-900 border border-orange-primary/20 rounded-lg overflow-hidden shadow-lg hover:shadow-orange-primary/20 hover:border-orange-primary transition-all duration-300">
      <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900">
        {getImageUrl() && !imageError ? (
          <img
            src={getImageUrl()}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16 mb-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Kapak Yok</span>
          </div>
        )}
        {book.isFeatured && (
          <div className="absolute top-2 right-2 bg-orange-primary text-white px-2 py-1 rounded text-xs font-bold z-20">
            ⭐ Editör Seçimi
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-base font-bold text-white mb-1.5 line-clamp-2 min-h-[2.5rem]">{book.title}</h3>
        <p className="text-xs text-gray-400 mb-2 line-clamp-2">
          {book.authors && book.authors.length > 0
            ? book.authors.map((a) => a.name).join(', ')
            : 'Yazar Bilgisi Yok'}
        </p>
        <div className="flex flex-col gap-2 mt-3">
          <span className="text-xs text-gray-400">
            {book.availableCopies || 0} / {book.totalCopies || 0} kopya
          </span>
          {showBorrowButton && book.availableCopies > 0 && !isBorrowed && (
            <button
              onClick={handleBorrow}
              className="bg-orange-primary hover:bg-orange-dark text-white px-3 py-1.5 rounded text-xs font-medium transition-colors w-full"
            >
              Ödünç Al
            </button>
          )}
          {showBorrowButton && isBorrowed && (
            <span className="text-orange-400 text-xs font-semibold text-center">Ödünçte</span>
          )}
          {showBorrowButton && book.availableCopies === 0 && !isBorrowed && (
            <span className="text-red-400 text-xs text-center">Stokta Yok</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookCard

