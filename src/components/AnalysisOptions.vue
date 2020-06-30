<template>
  <div class="section">
    <div class="field">
      <label class="label">Select first ontolog(y/ies)</label>
      <b-checkbox
        v-for="docGroup in documentGroups"
        :key="docGroup.id + '_1'"
        :native-value="docGroup.id"
        v-model="selectedSets1"
      >{{ docGroup.name }}</b-checkbox>
    </div>
    <b-field label="Set operation">
      <b-select placeholder="Select" v-model="selectedOperation">
        <option value="union">Union</option>
        <option value="intersection">Intersection</option>
        <option value="difference">Difference</option>
      </b-select>
    </b-field>
    <div class="field">
      <label class="label">Select second ontolog(y/ies)</label>
      <b-checkbox
        v-for="docGroup in documentGroups"
        :key="docGroup.id + '_2'"
        :native-value="docGroup.id"
        v-model="selectedSets2"
      >{{ docGroup.name }}</b-checkbox>
    </div>

    <b-field label="Only show code groups">
      <b-switch v-model="showCategoryGroups"></b-switch>
    </b-field>

    <b-field label="✨✨">
      <button class="button" v-on:click="submitOptions()">Submit</button>
    </b-field>
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
      showCategoryGroups: true,
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
      this.$store.commit("options/setShowCategoryGroups", this.showCategoryGroups);

      this.$emit("start-analysis")
    }
  }
};
</script>