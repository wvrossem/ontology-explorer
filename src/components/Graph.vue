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

import cola from 'cytoscape-cola';
import coseBilkent from 'cytoscape-cose-bilkent';
import expandCollapse from 'cytoscape-expand-collapse';
import klay from 'cytoscape-klay';
import cise from 'cytoscape-cise';

const elements = [...config.elements];
delete config.elements;

let resolveCy = null
export const cyPromise = new Promise(resolve => (resolveCy = resolve))

export default {
  data() {
    return {
      config,
      elements
    };
  },
  props: {
  },
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

      let neighborhood = cy.$(`#${node.id}`).closedNeighborhood();

      neighborhood = neighborhood.map((el) => {
        return {
          name: el.data().name,
          classes: el.classes(),
          group: el.group()
        }
      });
      neighborhood = neighborhood.filter((el) => el.group === "nodes");

      node.neighborhood = neighborhood;

      this.$emit('set-selected-node', node)
    },
    updateNode(event) {
      console.log("right click node", event);
    },
    preConfig(cytoscape) {
      console.log("calling pre-config", cytoscape);
      cytoscape.use( cola );
      cytoscape.use( coseBilkent );
      cytoscape.use( expandCollapse );
      cytoscape.use( klay );
      cytoscape.use( cise );
    },
    async afterCreated(cy) {
      console.log("calling after-created", cy);
      await cy;

      cy.layout(config.layout).run();

      resolveCy(cy);
    },
  },
};
</script>
