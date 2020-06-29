// initial state
const state = () => ({
  elements: []
})

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  setElements(state, elements) {
    state.elements = elements;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}