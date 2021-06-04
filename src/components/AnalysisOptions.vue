<template>
  <div class="container">
    <div class="columns">
      <div class="field column">
        <label class="label">Select first data model(s)</label>
        <b-checkbox
          v-for="docGroup in documentGroups"
          :key="docGroup.id + '_1'"
          :native-value="docGroup.id"
          v-model="selectedSets1"
        >{{ docGroup.name }}</b-checkbox>
      </div>
      
      <div class="field column">
        <label class="label">Select second data model(s)</label>
        <b-checkbox
          v-for="docGroup in documentGroups"
          :key="docGroup.id + '_2'"
          :native-value="docGroup.id"
          v-model="selectedSets2"
        >{{ docGroup.name }}</b-checkbox>
      </div>
    </div>

    <div class="columns">
      <div class="column is-2">
        <b-field label="Set operation">
          <b-select placeholder="Select" v-model="selectedOperation">
            <option value="union">Union</option>
            <option value="intersection">Intersection</option>
            <option value="difference">Difference</option>
          </b-select>
        </b-field>
      </div>

      <div class="column is-2">
        <b-field label="Include codes">
          <b-switch v-model="showCodes"></b-switch>
        </b-field>
      </div>

      <div class="column is-2">
        <b-field label="Include code groups">
          <b-switch v-model="showCategoryGroups"></b-switch>
        </b-field>
      </div>

      <div class="column is-2">
        <b-field label="✨✨">
          <button class="button" v-on:click="submitOptions()">Submit</button>
        </b-field>
      </div>
    </div>

    
  </div>
</template>

<script>
import { get, isEmpty } from "lodash";
import { mapState, mapGetters } from 'vuex';

export default {
  name: "AnalysisOptions",
  data() {
    return {
      selectedSets1: [],
      selectedSets2: [],
      selectedOperation: "union",
      showCodes: true,
      showCategoryGroups: false,
    }
  },
  computed: {
    ...mapGetters({
      documentGroups: "project/documentGroups",
    })
  },
  methods: {
    submitOptions() {
      this.$store.commit("options/setSelectedSets1", this.selectedSets1);
      this.$store.commit("options/setSelectedSets2", this.selectedSets2);
      this.$store.commit("options/setSetOperation", this.selectedOperation);
      this.$store.commit("options/setShowCodes", this.showCodes);
      this.$store.commit("options/setShowCategoryGroups", this.showCategoryGroups);

      this.$emit("start-analysis")
    }
  }
};
</script>