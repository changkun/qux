import axios from './axios'

export const fetchQuestionaire = function fetchQuestionaire(uuid) {
  return axios.get(`/api/questionaire?code=${uuid}`)
}

export const submitQuestionaire = function submitQuestionaire(payload) {
  return axios.post('/api/questionaire', payload)
}
