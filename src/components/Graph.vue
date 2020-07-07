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
import { mapState, mapGetters } from "vuex";
import get from 'lodash/get';
import head from 'lodash/head';
import join from 'lodash/join';

import cola from "cytoscape-cola";
import coseBilkent from "cytoscape-cose-bilkent";
import klay from "cytoscape-klay";
import cise from "cytoscape-cise";

let resolveCy = null;
export const cyPromise = new Promise(resolve => (resolveCy = resolve));

export default {
  data() {
    return {
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
    addNode(event) {},
    clickNode(event, data) {},
    updateNode(event) {},
    preConfig(cytoscape) {
      cytoscape.use(cola);
      cytoscape.use(coseBilkent);
      cytoscape.use(klay);
      cytoscape.use(cise);
    },
    async afterCreated(cy) {
      await cy;

      cy.layout(this.config.layout).run();

      resolveCy(cy);
    }
  }
};
</script>
