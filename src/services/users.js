import axios from './axios'

export const register = function register(payload) {
  return axios.post('/api/auth/register', payload)
}

export const edit = function edit(payload) {
  return axios.post('/api/auth/edit', payload)
}

export const destroy = function destroy(payload) {
  return axios.post('/api/auth/destroy', payload)
}


export const login = function login(payload) {
  return axios.post('/api/auth/login', payload)
}

export const logout = function logout() {
  return axios.get('/api/auth/logout')
}

// export const fetchCurrentUserInfo = function fetchCurrentUserInfo() {
//   return axios.get('/api/users/pull')
// }

// export const fetchUserInfo = function fetchUserInfo(id) {
//   return axios.get(`/api/users/${id}`)
// }

// export const validateInvitationCode = function validateInvitationCode(payload) {
//   return axios.post('/api/applicants/check', payload)
// }

// export const fetchNotifications = function fetchNotifications() {
//   return axios.get('/api/notifications')
// }

// export const fetchSettings = function fetchSettings() {
//   return axios.get('/api/usersettings')
// }

// export const updateSettings = function fetchSettings(payload) {
//   return axios.post('/api/usersettings', payload)
// }

// export const fetchTasksOfUser = function fetchTasksOfUser(id) {
//   return axios.get(`/api/statistics/user/task/${id}`)
// }
