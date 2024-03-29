import axios from 'axios'
import nprogress from 'nprogress'

const store = require('store')

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const instance = axios.create()

instance.interceptors.request.use((config) => {
  nprogress.start()
  return config
}, (error) => {
  nprogress.done()
  return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
  nprogress.done()
  return Promise.resolve(response.data)
}, (err) => {
  nprogress.done()

  // Authentication failed
  if (err.response.status === 401) {
    store.remove('user')
  }

  err.response.data.status = err.response.status

  return Promise.reject(err.response.data)
})

export default instance
