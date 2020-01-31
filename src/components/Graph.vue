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
      v-on:mousedown="deleteNode($event, def.data.id)"
    />
  </cytoscape>
</template>

<script>
import config from "../assets/graph-config";

import cola from 'cytoscape-cola';

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
    'showNodes': {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /* eslint-disable no-console */
    addNode(event) {
      console.log(event.target, this.$refs.cyRef.instance);
      if (event.target === this.$refs.cyRef.instance)
        console.log("adding node", event.target);
    },
    deleteNode(id) {
      console.log("node clicked", id);
    },
    updateNode(event) {
      console.log("right click node", event);
    },
    preConfig(cytoscape) {
      console.log("calling pre-config", cytoscape);
      cytoscape.use(cola);
    },
    async afterCreated(cy) {
      console.log("calling after-created", cy);
      await cy
      cy.layout(config.layout).run()
      resolveCy(cy)
    },
  },
  watch: {
    showNodes: async function (val) {
      const cy = await cyPromise
      this.elements = elements.map((el) => {
        el.classes = 'hidden'
        return el;
      })
      cy.elements = this.elements;
      cy.layout(this.config.layout).run()
    } 
  }
};
</script>
