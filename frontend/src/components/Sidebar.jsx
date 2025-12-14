import { useState } from 'react'

const Sidebar = ({ categories, selectedCategory, onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-950 to-black p-6 h-screen overflow-y-auto sticky top-0 shadow-2xl shadow-black/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl font-bold text-white mb-8 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 group"
      >
        <span className="flex items-center gap-3">
          <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          Kategoriler
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <nav className="space-y-3">
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-200 font-semibold text-sm tracking-wide ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105'
                : 'bg-gray-800/40 text-gray-100 hover:bg-gray-700/50 border border-orange-500/20 hover:border-orange-500/50 hover:shadow-md hover:shadow-orange-500/20 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">📖</span>
              Tümü
            </span>
          </button>
          {categories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => onCategorySelect(category)}
              className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-200 font-semibold text-sm tracking-wide ${
                selectedCategory?.categoryId === category.categoryId
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-gray-800/40 text-gray-100 hover:bg-gray-700/50 border border-orange-500/20 hover:border-orange-500/50 hover:shadow-md hover:shadow-orange-500/20 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-lg">📚</span>
                <span className="line-clamp-1">{category.name}</span>
              </span>
            </button>
          ))}
        </nav>
      )}
    </aside>
  )
}

export default Sidebar

