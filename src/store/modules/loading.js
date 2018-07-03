const state = {
  text: 'loading...',
  status: false,
}

const mutations = {
  showLoading(state) {
    state.status = true
  },
  hideLoading(state) {
    state.status = false
    state.text = 'loading...'
  },
  setLoadingText(state, text) {
    state.text = text
  },
}

export default {
  state,
  mutations,
}
