import cytoscape from "cytoscape";
import {
  get, join, size, isEmpty, cloneDeep
} from "lodash";

import config from "@/assets/graph-config";
import style from "@/assets/graph-config-styles"

// config.style = style.styleShowCodes;
config.style = style.styleShowCodeGroups;

// initial state
const state = () => ({
  elements: [],
  model: null,
  elementsToVisualize: [],
  cytoscapeConfig: cloneDeep(config)
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

    let neighbourhood1 = cy.$(setIds1).closedNeighborhood();
    let neighbourhood2 = cy.$(setIds2).closedNeighborhood();

    // console.log(join(neighbourhood1.map(el => `#${el.data("id")}`), ", "));
    // console.log(join(neighbourhood2.map(el => `#${el.data("id")}`), ", "));

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

    const nodes = [];
    const edges = [];

    result.forEach((el) => {
      if (el.group() == "nodes") {
        nodes.push({
          data: {
            id: el.id(),
            name: el.data("name")
          },
          group: el.group(),
          classes: el.classes()
        })
      } else if (el.group() == "edges") {
        edges.push({
          data: {
            id: el.id(),
            source: el.source().id(),
            target: el.target().id()
          },
          group: el.group(),
          classes: el.classes()
        })
      }
    });

    state.elementsToVisualize = nodes.concat(edges);
    
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
  },
  switchShowCodes(context, value) {
    context.commit('switchShowCodes', value);
  },
  switchShowCodeGroups(context, value) {
    context.commit('switchShowCodeGroups', value);
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
  },
  switchShowCodes(state, value) {
    if(value) {
      state.cytoscapeConfig.style = style.styleShowCodes;
    } else {
      state.cytoscapeConfig.style = style.styleCodeGroups;
    }
  },
  switchShowCodeGroups(state, value) {
    if (value) {
      state.cytoscapeConfig.style = style.styleCodeGroups;
    } else {
      state.cytoscapeConfig.style = style.styleShowCodes;
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}