import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }

  const setUser = (userData) => {
    user.value = userData
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  }

  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/auth/login', credentials)
      const { access_token, user: userData } = response.data
      
      setToken(access_token)
      setUser(userData)
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/auth/register', userData)
      const { access_token, user: newUser } = response.data
      
      setToken(access_token)
      setUser(newUser)
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    error.value = null
  }

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
      return response.data
    } catch (err) {
      // If fetching profile fails, user might be logged out
      logout()
      throw err
    }
  }

  // Initialize auth headers if token exists
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    currentUser,
    login,
    register,
    logout,
    fetchProfile
  }
}) 