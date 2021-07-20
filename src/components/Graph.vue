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
import styles from "@/assets/graph-config-styles";

import { mapState } from "vuex";

import cola from "cytoscape-cola";
import coseBilkent from "cytoscape-cose-bilkent";
import klay from "cytoscape-klay";
import cise from "cytoscape-cise";

let resolveCy = null;
export const cyPromise = new Promise((resolve) => (resolveCy = resolve));

export default {
  data() {
    return {
      prevSelected: [],
      showCodes: false,
      showCodeGroups: true,
    };
  },
  computed: {
    ...mapState({
      elements: (state) => state.network.elementsToVisualize,
      config: (state) => state.network.cytoscapeConfig,
    }),
  },
  props: {},
  methods: {
    addNode(event) {},
    clickNode(event, data) {
      let name = event.target.data().name;
      let node = event.target.data();

      const cy = this.$refs.cyRef.instance;

      if (this.prevSelected.length > 0) {
        cy.$(this.prevSelected).toggleClass("selected");
      }

      let neighborhood = cy.$(`#${node.id}`).closedNeighborhood();

      let ids = neighborhood.map((el) => `#${el.id()}`).join(", ");
      cy.$(ids).toggleClass("selected");

      this.prevSelected = ids;
    },
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
    },
    switchShowCodes(value) {
      const cy = this.$refs.cyRef.instance;
      this.showCodes = value;
      if (this.showCodes && !this.showCodeGroups) {
        cy.style(styles.styleShowCodes);
      } else if (!this.showCodes && this.showCodeGroups) {
        cy.style(styles.styleShowCodeGroups);
      } else {
        cy.style(styles.styleShowAll);
      }
    },
    switchShowCodeGroups(value) {
      const cy = this.$refs.cyRef.instance;
      this.showCodeGroups = value;
      if (this.showCodeGroups && !this.showCodes) {
        cy.style(styles.styleShowCodeGroups);
      } else if (!this.showCodeGroups && this.showCodes) {
        cy.style(styles.styleShowCodes);
      } else {
        cy.style(styles.styleShowAll);
      }
    },
  },
};
</script>
