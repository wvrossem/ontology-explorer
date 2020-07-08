<template>
  <div class="section" id="about-text">
    <div class="column is-10 is-offset-1">
      <b-message type="is-danger" has-icon v-if="nrOfElements == 0">
        <div class="content">
          <p>No network is loaded!</p>

          <p>Please first load the project XML</p>
        </div>
      </b-message>
      <b-message type="is-danger" has-icon v-if="!isModelInitialized">
        <div class="content">
          <p>Network model is not initialized!</p>

          <p>Please return to the upload screen</p>
        </div>
      </b-message>
    </div>

    <div class="container">
      <div class="columns">
        <div class="column is-3 is-offset-1">
          <nav class="panel">
            <p class="panel-heading">Legend</p>
            <a class="panel-block">
              <span class="panel-icon">
                <b-icon type="is-danger" size="is-small" icon="circle"></b-icon>
              </span>
              Document group
            </a>
            <a class="panel-block">
              <span class="panel-icon">
                <b-icon type="is-info" size="is-small" icon="rhombus"></b-icon>
              </span>
              Code group
            </a>
            <a class="panel-block">
              <span class="panel-icon">
                <b-icon size="is-small" icon="circle"></b-icon>
              </span>
              Category
            </a>
            <p class="panel-heading">Options</p>
            <label class="panel-block">
              <b-switch v-model="showCodes" @input="onChangeShowCodes($event)">Show categories</b-switch>
            </label>
            <label class="panel-block">
              <b-switch v-model="showCodeGroups" @input="onChangeShowCodeGroups($event)">Show code groups</b-switch>
            </label>
          </nav>
        </div>
        <div class="column">
          <Graph ref="graphRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Graph from "@/components/Graph.vue";

export default {
  components: {
    Graph
  },
  data() {
    return {
      showCodes: false,
      showCodeGroups: true
    }
  },
  computed: {
    ...mapGetters({
      nrOfElements: "network/nrOfElements",
      isModelInitialized: "network/isModelInitialized",
      getOperationResult: "network/getOperationResult"
    })
  },
  methods: {
    ...mapActions([
      'network/switchShowCodes',
      'network/switchShowCodeGroups',
    ]),
    onChangeShowCodes(value) {
      this.$refs.graphRef.switchShowCodes(value);
    },
    onChangeShowCodeGroups(value) {
      this.$refs.graphRef.switchShowCodeGroups(value);
    }
  }
};
</script>