<template>
  <div id="app">
    <div class="row">
      <div style="flex: 30%; text-align:center">
        <img src="logoPC.jpg" alt="">
      </div>
      <div style="flex: 70%;">
        <h1>Ontology explorer</h1>
        <p>Experiment combining Vue.js and cytoscape for graph analysis</p>
        <p>Current selected node: {{ selectedNode }}</p>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <Graph
          :showNodes="showNodes"
          v-on:set-selected-node="onSetSelectedNode"
        ></Graph>
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
