import axios from './axios'

export const fetchProjects = function fetchProjects() {
  return axios.get('/api/projects')
}
export const createProjects = function createProjects(payload) {
  return axios.post('/api/projects/create', payload)
}

export const fetchProjectById = function fetchProjectById(id) {
  return axios.get(`/api/projects/${id}`)
}

export const editProject = function editProject(payload) {
  return axios.post('/api/projects/edit', payload)
}

export const deleteProject = function deleteProject(payload) {
  return axios.post('/api/projects/delete', payload)
}
