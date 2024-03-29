<template>
  <div class="section column is-10 is-offset-1">
    <div class="container">
      <b-message title="info" type="is-info" has-icon v-if="nrOfElements > 0">
        <div class="content">
          <p>Currently have a network of {{ nrOfElements }} nodes & links.</p>
        </div>
      </b-message>
      <b-message type="is-danger" has-icon v-if="nrOfElements == 0">
        <div class="content">
          <p>No network is loaded!</p>

          <p>Please first load the project XML</p>
        </div>
      </b-message>
      <b-message title="info" type="is-info" has-icon v-if="isModelInitialized">
        <div class="content">
          <p>Network model is initialized</p>
        </div>
      </b-message>
      <b-message type="is-danger" has-icon v-if="!isModelInitialized">
        <div class="content">
          <p>Network model is not initialized!</p>

          <p>Please return to the upload screen</p>
        </div>
      </b-message>
    </div>

    <div class="container" v-if="nrOfElements > 0 && isModelInitialized">
      <AnalysisOptions v-on:start-analysis="onStartAnalysis" />

      <hr />

      <div class="level-left">
        <div class="level-item">
          <b-button
            icon-left="download"
            v-bind:disabled="hasAnalysisElements()"
          >
            <download-csv
              :data="selectedNodes()"
              :separator-excel="false"
              delimiter=";"
              encoding="utf8"
              name="nodes.csv"
            >
              Download nodes CSV
            </download-csv>
          </b-button>
        </div>

        <div class="level-item">
          <b-button
            icon-left="download"
            v-bind:disabled="hasAnalysisElements()"
          >
            <download-csv
              :data="selectedEdges()"
              :separator-excel="false"
              delimiter=";"
              encoding="utf8"
              name="edges.csv"
            >
              Download edges CSV
            </download-csv>
          </b-button>
        </div>
      </div>
    </div>

    <hr />

    <b-loading
      :is-full-page="isFullPage"
      :active.sync="isLoading"
      :can-cancel="true"
    ></b-loading>

    <div v-if="nrOfElements > 0 && isModelInitialized">
      <NodeTable v-bind:data="nodes"></NodeTable>
    </div>
  </div>
</template>

<script>
import NodeTable from "@/components/NodeTable.vue";
import AnalysisOptions from "@/components/AnalysisOptions.vue";
import { mapState, mapGetters } from "vuex";
import head from "lodash/head";
import round from "lodash/round";
import isEmpty from "lodash/isEmpty";

export default {
  name: "NetworkAnalysis",
  components: {
    NodeTable,
    AnalysisOptions,
  },
  data() {
    return {
      selectedNode: this.initialSelectedNode,
      nodes: [],
      isLoading: false,
      isFullPage: true,
    };
  },
  props: {
    initialSelectedNode: {
      type: Object,
      default: () => {
        return {
          name: "",
          neighborhood: [],
        };
      },
    },
  },
  computed: {
    ...mapGetters({
      nrOfElements: "network/nrOfElements",
      isModelInitialized: "network/isModelInitialized",
      getOperationResult: "network/getOperationResult",
    }),
    ...mapState({
      elements: (state) => state.network.elementsToVisualize,
      model: (state) => state.network.model,
      selectedSets1: (state) => state.options.selectedSets1,
      selectedSets2: (state) => state.options.selectedSets2,
      setOperation: (state) => state.options.setOperation,
      showCodes: (state) => state.options.showCodes,
      showCategoryGroups: (state) => state.options.showCategoryGroups,
    }),
  },
  methods: {
    onSetSelectedNode: function (node) {
      let nodeClone = {
        name: node.name,
        neighborhood: node.neighborhood,
      };
      this.selectedNode = nodeClone;
    },
    onStartAnalysis: function () {
      this.isLoading = true;

      const result = this.getOperationResult(
        this.selectedSets1,
        this.selectedSets2,
        this.setOperation
      );

      this.onSetOperationResult(result);
    },
    onSetOperationResult: function (nodes) {
      let resultClone = nodes;

      if (this.showCategoryGroups && this.showCodes) {
        resultClone = resultClone.filter((node) => {
          const type = head(node.classes);
          return type == "code" || type == "code-group";
        });
      } else if (this.showCodes) {
        resultClone = resultClone.filter(
          (node) => head(node.classes) == "code"
        );
      } else if (this.showCategoryGroups) {
        resultClone = resultClone.filter(
          (node) => head(node.classes) == "code-group"
        );
      }

      resultClone = resultClone.map((node) => {
        return {
          id: node.id,
          node_name: node.name,
          node_type: head(node.classes),
          node_centrality_closeness: round(node.centrality_closeness, 4),
          node_centrality_betweenness: round(node.centrality_betweenness, 4),
          node_centrality_degree: round(node.centrality_degree, 4),
        };
      });
      this.nodes = resultClone;
      this.isLoading = false;
    },
    hasAnalysisElements() {
      return isEmpty(this.elements);
    },
    isDocumentOrCodeGoup(node) {
      return (
        node.classes.includes("document-group") ||
        node.classes.includes("code-group")
      );
    },
    isDocumentOrCodeGoupLink(edge) {
      return edge.classes.includes("code-group-document-group-link");
    },
    selectedNodes() {
      const elements = this.elements;
      const nodes = elements.filter((ele) => ele.group == "nodes");
      const filteredNodes = nodes.filter(this.isDocumentOrCodeGoup);

      return filteredNodes.map((node) => ({
        id: node.data.id,
        label: node.data.name,
        type: node.classes[0],
      }));
    },
    selectedEdges() {
      const elements = this.elements;
      const edges = elements.filter((ele) => ele.group == "edges");
      const edgesFiltered = edges.filter(this.isDocumentOrCodeGoupLink);

      return edgesFiltered.map((edge) => ({
        source: edge.data.source,
        target: edge.data.target,
      }));
    },
  },
};
</script>
