<template>
  <div id="app" class="level">
    <div class="container">

      <div class="level">
        <div class="level-left"> 
          <div class="level-item">
            <b-field label="Select first ontology">
              <b-select placeholder="Select" v-model="selectedSet1">
                <option value="df_2">DE: Xauslander</option>
                <option value="df_5">EU: Eurodac</option>
                <option value="df_6">EU: SIS</option>
                <option value="df_7">EU: VIS</option>
                <option value="df_9">GR: XKA</option>
                <option value="df_12">IO: IOM - MiMOSA</option>
              </b-select>
            </b-field>
          </div>
          <div class="level-item">
            <b-field label="Set operation">
              <b-select placeholder="Select" v-model="selectedOperation">
                <!-- <option value="union">Union</option> -->
                <option value="intersection">Intersection</option>
                <option value="difference">Difference</option>
              </b-select>
            </b-field>
          </div>
          <div class="level-item">
            <b-field label="Select second ontology">
              <b-select placeholder="Select" v-model="selectedSet2">
                <option value="df_2">DE: Xauslander</option>
                <option value="df_5">EU: Eurodac</option>
                <option value="df_6">EU: SIS</option>
                <option value="df_7">EU: VIS</option>
                <option value="df_9">GR: XKA</option>
                <option value="df_12">IO: IOM - MiMOSA</option>
              </b-select>
            </b-field>
          </div>

          <div class="level-item">
            <b-field label="Show category groups">
              <b-switch v-model="showCategoryGroups"></b-switch>
            </b-field>
          </div>

          <div class="level-item">
            <b-field label="✨✨">
              <button class="button"
                v-on:click="startSetOperation()">
                Submit
              </button>
            </b-field>
          </div>

          
        </div>
      </div>

      <div class="level">
        <div class="level-left"> 
          <div class="level-item">
            
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-one-thirds">
          <NodeTable v-bind:data="nodes"></NodeTable>
        </div>
        <div class="column">
          
          <Graph
            ref="graph"
            v-on:set-selected-node="onSetSelectedNode"
            v-on:set-operation-results="onSetOperationResult"
          ></Graph>

          <hr>

          <!-- <NodeInfo -->
            <!-- v-bind:node="selectedNode" -->
          <!-- /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Graph from './components/Graph.vue'
import NodeInfo from './components/NodeInfo.vue'
import clone from 'lodash/clone';
import head from 'lodash/head';
import NodeTable from './components/NodeTable.vue'

export default {
  name: 'app',
  components: {
    Graph,
    // NodeInfo,
    NodeTable
  },
  data() {
    return {
      selectedNode: this.initialSelectedNode,
      selectedSet1: "",
      selectedSet2: "",
      selectedOperation: "",
      showCategoryGroups: false,
      nodes: []
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
      let nodeClone = {
        "name": node.name,
        "neighborhood": node.neighborhood
      };
      this.selectedNode = nodeClone;
    },
    startSetOperation: function () {
      console.log("starting set operation from app")
      this.$refs.graph.startSetOperation(this.selectedSet1, this.selectedSet2, this.selectedOperation);
    },
    onSetOperationResult: function (nodes) {
      let resultClone = nodes;

      if(!this.showCategoryGroups) {
        resultClone = resultClone.filter((node) => head(node.classes) == "code");
      }

      resultClone = resultClone.map((node) => {
        return {
          "id": node.id,
          "node_name": node.name,
          "node_type": head(node.classes)
        }
      });
      this.nodes = resultClone;
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