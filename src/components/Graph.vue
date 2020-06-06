<template>
  <cytoscape
    ref="cyRef"
    :config="config"
    v-on:mousedown="addNode"
    v-on:cxttapstart="updateNode"
    :preConfig="preConfig"
    :afterCreated="afterCreated"
    v-on:start-set-operation="startSetOperation"
  >
    <cy-element
      v-for="def in elements"
      :key="`${def.data.id}`"
      :definition="def"
      v-on:click="clickNode"
    />
  </cytoscape>
</template>

<script>
import config from "../assets/graph-config";

import get from 'lodash/get';
import head from 'lodash/head';
import join from 'lodash/join';

import cola from "cytoscape-cola";
import coseBilkent from "cytoscape-cose-bilkent";
import expandCollapse from "cytoscape-expand-collapse";
import klay from "cytoscape-klay";
import cise from "cytoscape-cise";

const elements = [...config.elements];
delete config.elements;

let prevSelected = "";

let resolveCy = null;
export const cyPromise = new Promise(resolve => (resolveCy = resolve));

export default {
  data() {
    return {
      config,
      elements,
      prevSelected
    };
  },
  props: {},
  methods: {
    /* eslint-disable no-console */
    addNode(event) {
      console.log(event.target, this.$refs.cyRef.instance);
      if (event.target === this.$refs.cyRef.instance)
        console.log("adding node", event.target);
    },
    clickNode(event, data) {
      let name = event.target.data().name;
      let node = event.target.data();

      const cy = this.$refs.cyRef.instance;

      if (this.prevSelected.length > 0) {
        cy.$(this.prevSelected).toggleClass("selected");
      }

      let neighborhood = cy.$(`#${node.id}`).closedNeighborhood();

      let ids = neighborhood.map(el => `#${el.id()}`).join(', ');
      console.log(ids);
      cy.$(ids).toggleClass("selected");

      this.prevSelected = ids;

      neighborhood = neighborhood.map(el => {
        return {
          name: el.data().name,
          classes: el.classes(),
          group: el.group()
        };
      });
      neighborhood = neighborhood.filter(el => el.group === "nodes");

      node.neighborhood = neighborhood;

      this.$emit("set-selected-node", node);
    },
    updateNode(event) {
      console.log("right click node", event);
    },
    startSetOperation(sets1, sets2, operation) {
      const cy = this.$refs.cyRef.instance;

      if (this.prevSelected.length > 0) {
        cy.$(this.prevSelected).removeClass("selected");
      }

      const setIds1 = join(sets1.map(setId => `#${setId}`), ", ");
      const setIds2 = join(sets2.map(setId => `#${setId}`), ", ");

      let neighbourhood1 = cy.$(setIds1).closedNeighborhood();
      let neighbourhood2 = cy.$(setIds2).closedNeighborhood();

      let result;
      
      if (operation == "intersection") {
        result = neighbourhood1.intersection(neighbourhood2);
      } else if (operation == "difference") {
        result = neighbourhood1.difference(neighbourhood2);
      }

      let ids = result.map(el => `#${el.id()}`).join(', ').concat(`, ${setIds1}, ${setIds2}`);

      cy.$(`${setIds1}, ${setIds2}`).addClass("selected");

      this.prevSelected = ids;

      // const dc = cy.elements().degreeCentrality({ directed: true});
      const ccn = cy.elements().closenessCentralityNormalized();
      const bc = cy.elements().bc();

      cy.nodes().forEach( n => {
        n.data({
          centrality_closeness: ccn.closeness(n),
          centrality_betweenness: bc.betweenness(n),
          centrality_degree: cy.elements().degreeCentrality({ root: `#${n.id()}`, directed: true }).degree
        });
      });

      result = result.map(el => {
        return {
          id: el.id(),
          name: get(el.data(), "name", ""),
          classes: el.classes(),
          group: el.group(),
          centrality_closeness: el.data().centrality_closeness,
          centrality_betweenness: el.data().centrality_betweenness,
          centrality_degree: el.data().centrality_degree
        };
      });

      result = result.filter(el => el.group === "nodes");

      this.$emit("set-operation-results", result);
    },
    showNodes(nodes) {
      const cy = this.$refs.cyRef.instance;

      const ids = nodes.map(el => `#${el.id}`).join(', ');

      let neighborhood = cy.$(ids).closedNeighborhood();
      neighborhood = neighborhood.filter(n => !n.hasClass("document-group") && !n.hasClass("code-group-document-group-link"))
      neighborhood.forEach(el => el.addClass("selected"));
    },
    searchNode(node) {
      const cy = this.$refs.cyRef.instance;

      const dfs = cy.elements().dfs({
        roots: "#df_3",
        visit: function(v, e, u, i, depth) {
          console.log("visit " + v.id());

          // example of finding desired node
          if (v.data("name") == "application number") {
            return true;
          }
        },
        directed: false
      });

      const path = dfs.path; // path to found node
      const found = dfs.found; // found node

      // select the path
      path.select();
    },
    preConfig(cytoscape) {
      console.log("calling pre-config", cytoscape);
      cytoscape.use(cola);
      cytoscape.use(coseBilkent);
      cytoscape.use(expandCollapse);
      cytoscape.use(klay);
      cytoscape.use(cise);
    },
    async afterCreated(cy) {
      console.log("calling after-created", cy);
      await cy;

      cy.layout(config.layout).run();

      resolveCy(cy);
    }
  }
};
</script>
