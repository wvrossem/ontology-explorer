<template>
  <section>
    <b-field>
      <b-upload
        v-model="dropFiles"
        accept="text/xml"
        multiple
        drag-drop
        expanded
      >
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large"></b-icon>
            </p>
            <p>Drop your file here or click to upload</p>
          </div>
        </section>
      </b-upload>
    </b-field>

    <div class="field" v-if="dropFiles.length">
      <label class="label">Selected files</label>

      <div
        v-for="(file, index) in dropFiles"
        :key="index"
        class="tags has-addons"
      >
        <span class="tag is-rounded is-info">{{ file.name }}</span>
        <a class="tag is-delete" @click="deleteDropFile(index)"></a>
      </div>
    </div>

    <div class="level">
      <b-button
        type="is-primary"
        expanded
        @click="processFiles"
        v-bind:loading="isUploadInProgress"
        v-bind:disabled="isUploadDisabled"
      >
        <b-icon icon="progress-wrench" size="is-small"></b-icon>
        <span>Upload and transform</span>
      </b-button>
    </div>

    <div class="level" v-if="fileContentPreview">
      <b-message title="File content preview" type="is-success" has-icon>
        {{ fileContentPreview }}
      </b-message>
    </div>

    <div class="level" v-if="projElements && network">
      <b-message
        title="Successfully parsed XML and generated the network"
        type="is-success"
        has-icon
      >
        <div class="content">
          <p>
            Imported {{ projElements.docGroups.size() }} document groups,
            {{ projElements.documents.size() }} documents,
            {{ projElements.codes.size() }} codes,
            {{ projElements.codeGroups.size() }} code groups, and
            {{ projElements.quotations.size() }} quotations.
          </p>
          <p>Created a network of {{ network.length }} nodes & links.</p>
        </div>
      </b-message>
    </div>

    <div class="level" v-if="isModelInitialized">
      <b-message
        title="Network model"
        type="is-success"
        has-icon
        v-if="isModelInitialized"
      >
        <div class="content">
          <p>
            Network model is initialized in the graph library and can now be
            used for further analysis and visualization.
          </p>
        </div>
      </b-message>
    </div>

    <h2 class="title">Or, load a sample project</h2>
    <div class="content">
      <p>Click on one of the following two buttons to load a sample project:</p>
    </div>
    <div class="content">
      <b-button type="is-info" expanded @click="loadSampleProject1">
        <b-icon icon="progress-wrench" size="is-small"></b-icon>
        <span>Passenger locator forms project</span>
      </b-button>
    </div>
  </section>
</template>

<script>
import { isEmpty } from "lodash";
import { mapState, mapGetters } from "vuex";
import { processXMLProjectString } from "../util/load_atlas_xml";
import { transformAtlasToCyto } from "../util/transform_atlas_to_cyto";
import fs from "fs";

import natural from "natural";

export default {
  data() {
    return {
      dropFiles: [],
      fileContent: null,
      fileContentPreview: null,
      isUploadInProgress: false,
      projElements: null,
      network: null,
    };
  },
  computed: {
    isUploadDisabled: function () {
      return isEmpty(this.dropFiles);
    },
    ...mapGetters({
      isModelInitialized: "network/isModelInitialized",
    }),
  },
  methods: {
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
      this.$buefy.toast.open({
        message: "File removed",
        type: "is-info",
      });
    },
    processFiles() {
      if (isEmpty(this.dropFiles)) {
        this.$buefy.toast.open({
          message: "Please first select a file to upload",
          type: "is-warning",
        });
        return;
      }
      this.isUploadInProgress = true;
      this.fileContent = null;
      this.fileContentPreview = null;
      const file = this.dropFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const evtData = {
          file,
          data: e.target.result,
        };
        this.$emit("reader-load", e.target.result);
        this.fileContent = e.target.result;
        this.fileContentPreview = this.fileContent.slice(0, 250);
        this.dropFiles = [];
        this.isUploadInProgress = false;
        this.$buefy.toast.open({
          message: "File processed succesfully!",
          type: "is-success",
        });
        this.processXMLProject();
      };
      reader.onerror = (e) => {
        this.$buefy.toast.open({
          duration: 5000,
          message: "Error occurred reading file",
          type: "is-danger",
        });
        this.isUploadInProgress = false;
      };
      this.fileContent = reader.readAsText(file);
    },
    // FIXME: move this code to util and import?
    addStringDistanceLinks(projElements) {
      // A set of hashes to avoid duplicate calculations
      // The set includes a hash of the code group Ids already processed
      const calculatedDistances = new Set();

      // Reference to the map for code legibility
      const codeGroupsMap = projElements.codeGroups.getCodeGroupsMap();

      // Cartesian product of the set of code groups to itself
      codeGroupsMap.forEach((codeGroup1, codeGroupId1) => {
        codeGroupsMap.forEach((codeGroup2, codeGroupId2) => {
          if (codeGroupId1 != codeGroupId2) {
            // If not same code groups, check if distance already calculated
            const hash1 = codeGroupId1 + codeGroupId2;
            const hash2 = codeGroupId2 + codeGroupId1;
            if (
              !(
                calculatedDistances.has(hash1) || calculatedDistances.has(hash2)
              )
            ) {
              // Calculate the distance between names and add a link to first code group
              // Ref: <https://naturalnode.github.io/natural/string_distance.html>
              // FIXME: this only works for symmetrical distance measures
              const distance = natural.JaroWinklerDistance(
                codeGroup1.name,
                codeGroup2.name
              );
              // Filter out less relevant similar strings. The number was chosen after some tests.
              if (distance > 0.82) {
                console.info(
                  `Added a link between "${codeGroup1.name}" and "${codeGroup2.name}". Distance = ${distance}`
                );
                codeGroup1.linkCodeGroup(codeGroupId2, distance);
              }
              // Add hashes to set so we don't recalculate again
              // Assumes that distance(id1, id2) (approx) equal to distance(id2, id1)
              calculatedDistances.add(hash1);
              calculatedDistances.add(hash2);
            }
          }
        });
      });
    },
    processXMLProject() {
      this.projElements = processXMLProjectString(this.fileContent);

      this.addStringDistanceLinks(this.projElements);

      this.$store.commit("project/setDocuments", this.projElements.documents);
      this.$store.commit("project/setQuotations", this.projElements.quotations);
      this.$store.commit("project/setCodes", this.projElements.codes);
      this.$store.commit("project/setCodeGroups", this.projElements.codeGroups);
      this.$store.commit("project/setDocGroups", this.projElements.docGroups);
      this.network = transformAtlasToCyto(this.projElements);
      this.$store.commit("network/setElements", this.network);
      this.$store.dispatch("network/initializeModel");
    },
    loadSampleProject1() {
      const that = this;
      fetch("passenger-location-forms.xml")
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          that.fileContent = data;
          that.processXMLProject();
        });
    },
  },
};
</script>
