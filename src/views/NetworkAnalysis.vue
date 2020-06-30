<template>
  <div id="home" class="container">
    <div class="section">
      <div class="columns">
        <div class="column is-half">
          <AnalysisOptions/>
        </div>

        <div class="column">
          <NodeTable v-bind:data="nodes" v-on:show-nodes="onShowNodes"></NodeTable>
        </div>
      </div>
    </div>

    <div class="section">
      <Graph
        ref="graph"
        v-on:set-selected-node="onSetSelectedNode"
        v-on:set-operation-results="onSetOperationResult"
      ></Graph>
    </div>
  </div>
</template>

<script>
import Graph from "@/components/Graph.vue";
import NodeInfo from "@/components/NodeInfo.vue";
import NodeTable from "@/components/NodeTable.vue";
import AnalysisOptions from "@/components/AnalysisOptions.vue";
import clone from "lodash/clone";
import head from "lodash/head";
import round from "lodash/round";

export default {
  name: "NetworkAnalysis",
  components: {
    Graph,
    // NodeInfo,
    NodeTable,
    AnalysisOptions
  },
  data() {
    return {
      selectedNode: this.initialSelectedNode,
      nodes: []
    };
  },
  props: {
    initialSelectedNode: {
      type: Object,
      default: () => {
        return {
          name: "",
          neighborhood: []
        };
      }
    }
  },
  methods: {
    onSetSelectedNode: function(node) {
      let nodeClone = {
        name: node.name,
        neighborhood: node.neighborhood
      };
      this.selectedNode = nodeClone;
    },
    startSetOperation: function() {
      console.log("starting set operation from app");
      this.$refs.graph.startSetOperation(
        this.selectedSet1,
        this.selectedSet2,
        this.selectedOperation
      );
    },
    onShowNodes: function(nodes) {
      console.log("Test: ", nodes);
      this.$refs.graph.showNodes(nodes);
    },
    onSetOperationResult: function(nodes) {
      let resultClone = nodes;

      if (this.showCategoryGroups) {
        resultClone = resultClone.filter(
          node => head(node.classes) == "code-group"
        );
      }

      resultClone = resultClone.map(node => {
        return {
          id: node.id,
          node_name: node.name,
          node_type: head(node.classes),
          node_centrality_closeness: round(node.centrality_closeness, 4),
          node_centrality_betweenness: round(node.centrality_betweenness, 4),
          node_centrality_degree: node.centrality_degree
        };
      });
      this.nodes = resultClone;
    }
  }
};
</script>
