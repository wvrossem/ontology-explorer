import cytoscape from "cytoscape";
import {
  get, join, size, isEmpty
} from "lodash";

// initial state
const state = () => ({
  elements: [],
  model: null
})

// getters
const getters = {
  nrOfElements(state) {
    return size(state.elements);
  },
  isModelInitialized(state) {
    return !isEmpty(state.model);
  },
  getOperationResult: (state) => (sets1, sets2, operation) => {
    const cy = state.model;

    const setIds1 = join(sets1.map(setId => `#${setId}`), ", ");
    const setIds2 = join(sets2.map(setId => `#${setId}`), ", ");

    let neighbourhood1 = cy.$(setIds1).neighborhood();
    let neighbourhood2 = cy.$(setIds2).neighborhood();

    console.log(join(neighbourhood1.map(el => `#${el.data("id")}`), ", "));
    console.log(join(neighbourhood2.map(el => `#${el.data("id")}`), ", "));
    

    let result;

    if (operation == "intersection") {
      result = neighbourhood1.intersection(neighbourhood2);
    } else if (operation == "difference") {
      result = neighbourhood1.difference(neighbourhood2);
    } else if (operation == "union") {
      result = neighbourhood1.union(neighbourhood2);
    }

    let ids = result.map(el => `#${el.id()}`).join(', ').concat(`, ${setIds1}, ${setIds2}`);

    if (operation != "union") {
      result = result.map(el => {
        return {
          id: el.id(),
          name: get(el.data(), "name", ""),
          classes: el.classes(),
          group: el.group(),
          centrality_closeness: null,
          centrality_betweenness: null,
          centrality_degree: null
        };
      });

      return result;
    }
    
    const ccn = cy.$(ids).closenessCentralityNormalized({
      directed: false
    });
    const bc = cy.$(ids).betweennessCentrality({
      directed: false
    });
    const dcn = cy.$(ids).degreeCentralityNormalized({
      directed: false
    });
    
    result = result.map(el => {
      return {
        id: el.id(),
        name: get(el.data(), "name", ""),
        classes: el.classes(),
        group: el.group(),
        centrality_closeness: ccn.closeness(`#${el.id()}`),
        centrality_betweenness: bc.betweenness(`#${el.id()}`),
        centrality_degree: dcn.degree(`#${el.id()}`)
      };
    });

    result = result.filter(el => el.group === "nodes");

    // this.$emit("set-operation-results", result);
    return result;
  },
}

// actions
const actions = {
  initializeModel(context) {
    context.commit('initializeModel');
  }
}

// mutations
const mutations = {
  setElements(state, elements) {
    state.elements = elements;
  },
  initializeModel(state) {
    state.model = cytoscape({
      elements: state.elements,
    });
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}