import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
})

// give JWT token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('token from storage:', token)
  if (token) {
    if (!config.headers) {
      config.headers = {}
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// if 401, automatically logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api