// import union from 'lodash/union'
import assign from 'lodash/assign'
import * as projects from '@/services/projects'

const state = {
  data: {},
  finished: [],
  inprogress: [],
}

const getters = {
}

const mutations = {
  setProjects(state, payload) {
    assign(state.data, payload.inprogress[0])
    state.inprogress = payload.inprogress
    state.finished = payload.finished
  },
}

const groupProjects = (projects) => {
  const group = {
    inprogress: [],
    finished: [],
  }
  for (let i = 0; i < projects.length; i += 1) {
    const today = new Date()
    const start = new Date(projects[i].create_at)
    const end = start.setTime(start.getTime() + (3600 * 1000 * 24 * projects[i].duration))
    if (today < end) {
      group.inprogress.push(projects[i])
    } else {
      group.finished.push(projects[i])
    }
  }
  return group
}

const actions = {
  fetchProjects(context) {
    return projects.fetchProjects().then((data) => {
      context.commit('setProjects', groupProjects(data.projects))
      return Promise.resolve(groupProjects(data.projects))
    })
  },
  createProjects(context, payload) {
    return projects.createProjects(payload).then((data) => {
      if (data.success === true) {
        context.commit('setProjects', groupProjects(data.projects))
      }
      return Promise.resolve(data)
    })
  },
  fetchProjectById(payload) {
    return projects.fetchProjectById(payload).then(data => Promise.resolve(data))
  },
  editProjectById(context, payload) {
    return projects.editProject(payload).then((data) => {
      if (data.success === true) {
        // context.commit('setProjects', groupProjects(data.projects))
      }
      return Promise.resolve(data)
    })
  },
  deleteProjectById(context, payload) {
    return projects.deleteProject(payload).then(data => Promise.resolve(data))
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
