<template>
  <div id="app" class="container">
    <div class="section">
      <div class="columns">
        <div class="column is-half">
          <div class="field">
            <label class="label">Select first ontology</label>
            <b-checkbox v-model="selectedSet1"
                native-value="df_1">
                DE: Xauslander
            </b-checkbox>
            <b-checkbox v-model="selectedSet1"
                native-value="df_4">
                EU: Eurodac
            </b-checkbox>
            <b-checkbox v-model="selectedSet1"
                native-value="df_5">
                EU: SIS
            </b-checkbox>
            <b-checkbox v-model="selectedSet1"
                native-value="df_6">
                EU: VIS
            </b-checkbox>
            <b-checkbox v-model="selectedSet1"
                native-value="df_3">
                EU: EES
            </b-checkbox>
            <b-checkbox v-model="selectedSet1"
                native-value="df_2">
                EU: EU IS JHA
            </b-checkbox>
            <b-checkbox v-model="selectedSet1"
                native-value="df_9">
                GR: XKA
            </b-checkbox>
            <b-checkbox v-model="selectedSet1"
                native-value="df_12">
                IO: IOM - MiMOSA
            </b-checkbox>
          </div>
          <b-field label="Set operation">
            <b-select placeholder="Select" v-model="selectedOperation">
              <!-- <option value="union">Union</option> -->
              <option value="intersection">Intersection</option>
              <option value="difference">Difference</option>
            </b-select>
          </b-field>
          <div class="field">
            <label class="label">Select second ontology</label>
            <b-checkbox v-model="selectedSet2"
                native-value="df_1">
                DE: Xauslander
            </b-checkbox>
            <b-checkbox v-model="selectedSet2"
                native-value="df_4">
                EU: Eurodac
            </b-checkbox>
            <b-checkbox v-model="selectedSet2"
                native-value="df_5">
                EU: SIS
            </b-checkbox>
            <b-checkbox v-model="selectedSet2"
                native-value="df_6">
                EU: VIS
            </b-checkbox>
            <b-checkbox v-model="selectedSet2"
                native-value="df_3">
                EU: EES
            </b-checkbox>
            <b-checkbox v-model="selectedSet2"
                native-value="df_2">
                EU: EU IS JHA
            </b-checkbox>
            <b-checkbox v-model="selectedSet2"
                native-value="df_9">
                GR: XKA
            </b-checkbox>
            <b-checkbox v-model="selectedSet2"
                native-value="df_12">
                IO: IOM - MiMOSA
            </b-checkbox>
          </div>
        
          <b-field label="Only show category groups">
            <b-switch v-model="showCategoryGroups"></b-switch>
          </b-field>

          <b-field label="✨✨">
            <button class="button"
              v-on:click="startSetOperation()">
              Submit
            </button>
          </b-field>

        </div>

        <div class="column">
          <NodeTable 
            v-bind:data="nodes"
            v-on:show-nodes="onShowNodes">
          </NodeTable>
        </div>
      </div>
    </div>

    <div class="section">
      <Graph
          ref="graph"
          v-on:set-selected-node="onSetSelectedNode"
          v-on:set-operation-results="onSetOperationResult">
      </Graph>
    </div>
  </div>
</template>

<script>
import Graph from './components/Graph.vue'
import NodeInfo from './components/NodeInfo.vue'
import clone from 'lodash/clone';
import head from 'lodash/head';
import round from 'lodash/round';
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
      selectedSet1: [],
      selectedSet2: [],
      selectedOperation: "",
      showCategoryGroups: true,
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
    onShowNodes: function (nodes) {
      console.log("Test: ", nodes)
      this.$refs.graph.showNodes(nodes)
    },
    onSetOperationResult: function (nodes) {
      let resultClone = nodes;

      if(this.showCategoryGroups) {
        resultClone = resultClone.filter((node) => head(node.classes) == "code-group");
      }

      resultClone = resultClone.map((node) => {
        return {
          "id": node.id,
          "node_name": node.name,
          "node_type": head(node.classes),
          "node_centrality_closeness": round(node.centrality_closeness, 4),
          "node_centrality_betweenness": round(node.centrality_betweenness, 4),
          "node_centrality_degree": node.centrality_degree
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