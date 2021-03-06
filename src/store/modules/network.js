import cytoscape from "cytoscape";
import {
  get,
  join,
  size,
  isEmpty,
  cloneDeep
} from "lodash";

import config from "@/assets/graph-config";
import style from "@/assets/graph-config-styles"

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

    // Get the "extended neighbourhood" for both set ids
    // This includes the code - code groups links
    const neighbourhood1ExtendedCodes = neighbourhood1.filter(".code").closedNeighborhood();
    const neighbourhood1ExtendedCodeGroups = neighbourhood1.filter(".code-group").closedNeighborhood();
    const neighbourhood1Extended = neighbourhood1ExtendedCodes.intersection(neighbourhood1ExtendedCodeGroups).filter((el => {
      return !el.hasClass("document-group");
    }));
    const codeGroupDistances1 = neighbourhood1ExtendedCodeGroups.filter(".code-group-distance-link");

    const neighbourhood2ExtendedCodes = neighbourhood2.filter(".code").closedNeighborhood();
    const neighbourhood2ExtendedCodeGroups = neighbourhood2.filter(".code-group").closedNeighborhood();
    const neighbourhood2Extended = neighbourhood2ExtendedCodes.intersection(neighbourhood2ExtendedCodeGroups).filter((el => {
      return !el.hasClass("document-group");
    }));
    const codeGroupDistances2 = neighbourhood2ExtendedCodeGroups.filter(".code-group-distance-link");

    const codeGroupDistanesAll = codeGroupDistances1.intersection(codeGroupDistances2);

    neighbourhood1 = neighbourhood1.union(neighbourhood1Extended).union(codeGroupDistances1).filter((el => {
      return !el.hasClass("code-document-group-link");
    }));
    neighbourhood2 = neighbourhood2.union(neighbourhood2Extended).union(codeGroupDistances2).filter((el => {
      return !el.hasClass("code-document-group-link");
    }));

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

    // Select only the code groups and document groups
    const elementsWithoutCodes = cy.$(ids).filter((el) => {
      return !(el.classes().includes("code") || el.classes().includes("code-group-link") || el.classes().includes("code-group-distance-link"))
    });

    const ccn = elementsWithoutCodes.closenessCentralityNormalized({
      directed: false
    });
    const bc = elementsWithoutCodes.betweennessCentrality({
      directed: false
    });
    const dcn = elementsWithoutCodes.degreeCentralityNormalized({
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

    return result;
  },
}

// actions
const actions = {
  initializeModel(context) {
    context.commit('initializeModel');
  },
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}