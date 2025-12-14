import axios from 'axios'

const API_BASE_URL = 'https://localhost:8443/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Browser'da self-signed certificate için
  // Not: Production'da gerçek sertifika kullanılmalı
})

// Books API
export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  getByIsbn: (isbn) => api.get(`/books/isbn/${isbn}`),
  getFeatured: () => api.get('/books/featured'),
  getLatest: () => api.get('/books/latest'),
  create: (book) => api.post('/books', book),
  update: (id, book) => api.put(`/books/${id}`, book),
  delete: (id) => api.delete(`/books/${id}`),
}

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
}

// Users API
export const usersAPI = {
  login: (username, password) => {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)
    return api.post(`/users/login?${params.toString()}`)
  },
  register: (userData) => api.post('/users', userData),
  forgotPassword: (email) => {
    const params = new URLSearchParams()
    params.append('email', email)
    return api.post(`/users/forgot-password?${params.toString()}`)
  },
  resetPassword: (token, newPassword) => {
    const params = new URLSearchParams()
    params.append('token', token)
    params.append('newPassword', newPassword)
    return api.post(`/users/reset-password?${params.toString()}`)
  },
  verifyAccount: (token) => {
    return api.get(`/users/verify?token=${token}`)
  },
  getAll: () => api.get('/users'),
  getByUsername: (username) => api.get(`/users/username/${username}`),
  create: (user) => api.post('/users', user),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),
}

// Borrowings API
export const borrowingsAPI = {
  getAll: () => api.get('/borrowings'),
  getByUser: (userId) => api.get(`/borrowings/user/${userId}`),
  borrow: (userId, bookId, notes) => {
    const params = new URLSearchParams()
    params.append('userId', userId)
    params.append('bookId', bookId)
    if (notes) params.append('notes', notes)
    return api.post(`/borrowings?${params.toString()}`)
  },
  return: (id) => api.put(`/borrowings/return/${id}`),
}

// Penalties API
export const penaltiesAPI = {
  getAll: () => api.get('/penalties'),
  getByUser: (userId) => api.get(`/penalties/user/${userId}`),
  calculate: () => api.post('/penalties/calculate'),
}

// Authors API
export const authorsAPI = {
  getAll: () => api.get('/authors'),
  getById: (id) => api.get(`/authors/${id}`),
  create: (author) => api.post('/authors', author),
  update: (id, author) => api.put(`/authors/${id}`, author),
  delete: (id) => api.delete(`/authors/${id}`),
}

export default api

