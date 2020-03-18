<template>
  <div id="app" class="level">
    <div class="container">
      <div class="columns">
        <div class="column is-two-thirds">
          <Graph
            v-on:set-selected-node="onSetSelectedNode"
          ></Graph>
        </div>
        <div class="column">
          <NodeInfo
            v-bind:node="selectedNode"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Graph from './components/Graph.vue'
import NodeInfo from './components/NodeInfo.vue'
import clone from 'lodash/clone';

export default {
  name: 'app',
  components: {
    Graph,
    NodeInfo
  },
  data() {
    return {
      selectedNode: this.initialSelectedNode
    }
  },
  props: {
    initialSelectedNode: {
      type: Object,
      default: () => {
        return {
          "name": "",
          "neighborhood": []
        }
      }
    }
  },
  methods: {
    onSetSelectedNode: function (node) {
      // let nodeClone = clone(node);
      // let neighborhood = node.neighborhood.filter((el) => el.group === "nodes").map((el) => el.data.name);
      let nodeClone = {
        "name": node.name,
        "neighborhood": node.neighborhood
      };
      console.log("test", nodeClone)
      this.selectedNode = nodeClone;
    }
  }
}
</script>

<style>

h1 {
  color: #bf0000;
}

#cytoscape-div {
  min-height: 600px;
  height: 600px;
}

.leaflet-popup-content {
  font-family: 'Arvo'
}

</style>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

$body-family: 'Arvo', 'Avenir', Helvetica, Arial, sans-serif;

$title-color: #bf0000;

$hero-body-padding: 1rem 1rem;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>  