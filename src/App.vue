<template>
  <div id="app">
    <div class="row">
      <div style="flex: 30%; text-align:center">
        <img src="logoPC.jpg" alt="">
      </div>
      <div style="flex: 70%;">
        <h1>Simple map and ontology explorer</h1>
        <p>Experiment combining Vue.js, Leaflet for map and cytoscape for graph</p>
        <p>Current set location: {{ currentLocation }}</p>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <Map 
          v-on:set-location="onSetLocation"
        ></Map>
      </div>
      <div class="column">
        <Graph
          :showNodes="showNodes"
        ></Graph>
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
  data() {
    return {
      showNodes: false
    }
  },
  props: {
    'currentLocation': String,
  },
  methods: {
    onSetLocation: function (location) {
      this.currentLocation = location;
      console.log(location)
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
