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
// import config from "../assets/graph-config";
import { mapState, mapGetters } from "vuex";
import get from 'lodash/get';
import head from 'lodash/head';
import join from 'lodash/join';

import cola from "cytoscape-cola";
import coseBilkent from "cytoscape-cose-bilkent";
import expandCollapse from "cytoscape-expand-collapse";
import klay from "cytoscape-klay";
import cise from "cytoscape-cise";

let prevSelected = "";

let resolveCy = null;
export const cyPromise = new Promise(resolve => (resolveCy = resolve));

export default {
  data() {
    return {
      // config,
      prevSelected
    };
  },
  computed: {
    ...mapState({
      elements: state => state.network.elementsToVisualize,
      config: state => state.network.cytoscapeConfig
    }),
  },
  props: {},
  methods: {
    /* eslint-disable no-console */
    addNode(event) {
      // console.log(event.target, this.$refs.cyRef.instance);
      // if (event.target === this.$refs.cyRef.instance)
      //   console.log("adding node", event.target);
    },
    clickNode(event, data) {
      // let name = event.target.data().name;
      // let node = event.target.data();

      // const cy = this.$refs.cyRef.instance;

      // if (this.prevSelected.length > 0) {
      //   cy.$(this.prevSelected).toggleClass("selected");
      // }

      // let neighborhood = cy.$(`#${node.id}`).closedNeighborhood();

      // let ids = neighborhood.map(el => `#${el.id()}`).join(', ');
      // console.log(ids);
      // cy.$(ids).toggleClass("selected");

      // this.prevSelected = ids;

      // neighborhood = neighborhood.map(el => {
      //   return {
      //     name: el.data().name,
      //     classes: el.classes(),
      //     group: el.group()
      //   };
      // });
      // neighborhood = neighborhood.filter(el => el.group === "nodes");

      // node.neighborhood = neighborhood;

      // this.$emit("set-selected-node", node);
    },
    updateNode(event) {},
    showNodes(nodes) {},
    searchNode(node) {},
    preConfig(cytoscape) {
      console.log("calling pre-config", cytoscape);
      cytoscape.use(cola);
      cytoscape.use(coseBilkent);
      // cytoscape.use(expandCollapse);
      cytoscape.use(klay);
      cytoscape.use(cise);
    },
    async afterCreated(cy) {
      console.log("calling after-created", cy);
      await cy;

      cy.layout(this.config.layout).run();

      resolveCy(cy);
    }
  }
};
</script>
