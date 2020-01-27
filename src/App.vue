<template>
  <div id="app">
    <div class="row">
      <div style="flex: 30%; text-align:center">
        <img src="logoPC.jpg" alt="">
      </div>
      <div style="flex: 70%;">
        <h1>Simple map and ontology explorer</h1>
        <p>Experiment combining Vue.js, Leaflet for map and cytoscape for graph</p>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <Map />
      </div>
      <div class="column">
        <Graph />
      </div>
    </div>
  </div>
</template>

<script>
import Map from './components/Map.vue'
import Graph from './components/Graph.vue'

export default {
  name: 'app',
  components: {
    Map,
    Graph
  },
}
</script>

<style>
@import '../node_modules/leaflet/dist/leaflet.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0px;
}

.row {
  display: flex;
	padding: 10px;
}

.column {
  flex: 50%;
  padding: 10px;
}

</style>
