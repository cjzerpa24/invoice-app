import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    
    // Handle 401 errors by redirecting to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
      // Only redirect if we're not already on auth pages
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/login'
      }
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
}

// Client API
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.patch(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
}

// Invoice API
export const invoicesAPI = {
  getAll: (params = {}) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.patch(`/invoices/${id}`, data),
  updateStatus: (id, status) => api.patch(`/invoices/${id}/status`, { status }),
  delete: (id) => api.delete(`/invoices/${id}`),
  generateNumber: () => api.get('/invoices/generate-number'),
}

// Personal Data API
export const personalDataAPI = {
  getAll: () => api.get('/personal-data'),
  getDefault: () => api.get('/personal-data/default'),
  getById: (id) => api.get(`/personal-data/${id}`),
  create: (data) => api.post('/personal-data', data),
  createOrUpdate: (data) => api.post('/personal-data/create-or-update', data),
  update: (id, data) => api.patch(`/personal-data/${id}`, data),
  delete: (id) => api.delete(`/personal-data/${id}`),
}

// PDF API
export const pdfAPI = {
  getInvoicePreview: (id, lang = 'en') => api.get(`/invoices/${id}/preview`, { params: { lang } }),
  downloadInvoicePdf: (id, lang = 'en') => api.get(`/invoices/${id}/pdf`, { params: { lang }, responseType: 'blob' })
}

export default api 