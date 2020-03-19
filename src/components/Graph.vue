<template>
  <cytoscape
    ref="cyRef"
    :config="config"
    v-on:mousedown="addNode"
    v-on:cxttapstart="updateNode"
    :preConfig="preConfig"
    :afterCreated="afterCreated"
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

      // cy.zoom({
      //   level: 1.5,
      //   position: cy.getElementById(node.id).position()
      // });

      // cy.$(`#${node.id}`).toggleClass("selected");

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

      console.log(path);
      console.log(found);

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

      // cy.zoom({
      //   level: 1.0, // the zoom level
      //   position: { x: 0, y: 0 }
      // });

      resolveCy(cy);
    }
  }
};
</script>
