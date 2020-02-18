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

const elements = [...config.elements];
delete config.elements;

const expandCollapseOptions = {
  layoutBy: null, // to rearrange after expand/collapse. It's just layout options or whole layout function. Choose your side!
  // recommended usage: use cose-bilkent layout with randomize: false to preserve mental map upon expand/collapse
  fisheye: true, // whether to perform fisheye view after expand/collapse you can specify a function too
  animate: true, // whether to animate on drawing changes you can specify a function too
  animationDuration: 1000, // when animate is true, the duration in milliseconds of the animation
  ready: function () {}, // callback when expand/collapse initialized
  undoable: true, // and if undoRedoExtension exists,

  cueEnabled: true, // Whether cues are enabled
  expandCollapseCuePosition: 'top-left', // default cue position is top left you can specify a function per node too
  expandCollapseCueSize: 12, // size of expand-collapse cue
  expandCollapseCueLineSize: 8, // size of lines used for drawing plus-minus icons
  expandCueImage: undefined, // image of expand icon if undefined draw regular expand cue
  collapseCueImage: undefined, // image of collapse icon if undefined draw regular collapse cue
  expandCollapseCueSensitivity: 1, // sensitivity of expand-collapse cues
  zIndex: 999 // z-index value of the canvas in which cue ımages are drawn
}

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
    clickNode(event, data) {
      let name = event.target.data().name;

      console.log("node clicked: ", name);
      this.$emit('set-selected-node', name)
    },
    updateNode(event) {
      console.log("right click node", event);
    },
    preConfig(cytoscape) {
      console.log("calling pre-config", cytoscape);
      cytoscape.use(cola);
      cytoscape.use(coseBilkent);
      cytoscape.use(expandCollapse);
    },
    async afterCreated(cy) {
      console.log("calling after-created", cy);
      await cy

      // cy.layout(config.layout).run()

      const api = cy.expandCollapse({
        layoutBy: {
          name: "cose-bilkent",
          animate: "end",
          randomize: true,
          fit: true,
          nodeDimensionsIncludeLabels: true,
          quality: 'default',
          tile: false
        },
        fisheye: true,
        animate: true,
        undoable: false
      });
      api.collapseAll();

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
