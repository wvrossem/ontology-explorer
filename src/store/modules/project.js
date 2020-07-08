import {
  get,
  isEmpty
} from "lodash";

// initial state
const state = () => ({
  documents: null,
  quotations: null,
  codes: null,
  codeGroups: null,
  docGroups: null
})

// getters
const getters = {
  documentGroups: state => {
    const docGroups = get(state, "docGroups.documentGroups");
    if (!isEmpty(docGroups)) {
      return [ ...docGroups.values()];
    } else {
      return [];
    }
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  setDocuments(state, documents) {
    state.documents = documents;
  },
  setQuotations(state, quotations) {
    state.quotations = quotations;
  },
  setCodes(state, codes) {
    state.codes = codes;
  },
  setCodeGroups(state, codeGroups) {
    state.codeGroups = codeGroups;
  }, 
  setDocGroups(state, docGroups) {
    state.docGroups = docGroups;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}