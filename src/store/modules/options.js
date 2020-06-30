// initial state
const state = () => ({
  selectedSets1: [],
  selectedSets2: [],
  setOperation: "",
  showCategoryGroups: true
})

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  setSelectedSets1(state, selectedSets1) {
    state.selectedSets1 = selectedSets1;
  },

  setSelectedSets2(state, selectedSets2) {
    state.selectedSets2 = selectedSets2;
  },

  setSetOperation(state, setOperation) {
    state.setOperation = setOperation;
  },

  setShowCategoryGroups(state, showCategoryGroups) {
    state.showCategoryGroups = showCategoryGroups;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}