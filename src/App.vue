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

export default {
  name: 'app',
  components: {
    Graph
  },
  data() {
    return {
      showNodes: false,
      selectedNode: this.initialSelectedNode
    }
  },
  props: ["initialSelectedNode"],
  methods: {
    onSetSelectedNode: function (node) {
      this.selectedNode = node;
      this.showNodes = true;
    }
  }
}
</script>

<style>
@import '../node_modules/leaflet/dist/leaflet.css';

#app, footer {
  font-family: 'Arvo', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
  margin-top: 0px;
}

h1 {
  color: #bf0000;
}

.row {
  display: flex;
	padding: 10px;
}

.column {
  flex: 50%;
  padding: 10px;
}

#cytoscape-div {
  height: 700px;
}

.leaflet-popup-content {
  font-family: 'Arvo'
}

</style>
