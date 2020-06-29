<template>
  <section>
    <b-field>
      <b-upload v-model="dropFiles" accept="text/xml" multiple drag-drop expanded>
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

      <div v-for="(file, index) in dropFiles" :key="index" class="tags has-addons">
        <span class="tag is-rounded is-info">{{file.name}}</span>
        <a class="tag is-delete" @click="deleteDropFile(index)"></a>
      </div>
    </div>

    <div class="level">
      <b-button type="is-primary" expanded @click="processFiles" 
        v-bind:loading="isUploadInProgress"
        v-bind:disabled="isUploadDisabled">
        <b-icon icon="progress-wrench" size="is-small"></b-icon>
        <span>Upload and transform</span>
      </b-button>
    </div>

    <div class="level" v-if="fileContentPreview">
      <b-message title="File content preview" type="is-success" has-icon >
        {{ fileContentPreview }}
      </b-message>
    </div>

    <div class="level" v-if="projElements && network">
      <b-message title="Successfully parsed XML and generated the network" type="is-success" has-icon >
        <div class="content">
          <p>Imported {{projElements.docGroups.size()}} document groups, {{projElements.documents.size()}} documents, {{projElements.codes.size()}} codes, {{projElements.codeGroups.size()}} code groups, and {{projElements.quotations.size()}} quotations.</p>
          <p>Created a network of {{network.length}} nodes & links.</p>
        </div>
      </b-message>
    </div>
  </section>
</template>

<script>
import { isEmpty } from "lodash";
import { processXMLProjectString } from "../util/load_atlas_xml";
import { transformAtlasToCyto } from "../util/transform_atlas_to_cyto";

export default {
  data() {
    return {
      dropFiles: [],
      fileContent: null,
      fileContentPreview: null,
      isUploadInProgress: false,
      projElements: null,
      network: null
    };
  },
  computed: {
    isUploadDisabled: function () {
      return isEmpty(this.dropFiles);
    }
  },
  methods: {
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
      this.$buefy.toast.open({
          message: 'File removed',
          type: 'is-info'
      })
    },
    processFiles() {
      if (isEmpty(this.dropFiles)) {
        this.$buefy.toast.open({
            message: 'Please first select a file to upload',
            type: 'is-warning'
        })
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
          data: e.target.result
        }
        this.$emit("reader-load", e.target.result);
        this.fileContent = e.target.result;
        this.fileContentPreview = this.fileContent.slice(0, 500);
        this.dropFiles = [];
        this.isUploadInProgress = false;
        this.$buefy.toast.open({
            message: 'File processed succesfully!',
            type: 'is-success'
        })
        this.processXMLProject();
      };
      reader.onerror = (e) => {
        this.$buefy.toast.open({
            duration: 5000,
            message: 'Error occurred reading file',
            type: 'is-danger'
        })
        this.isUploadInProgress = false;
      };
      this.fileContent = reader.readAsText(file);
    },
    processXMLProject() {
      this.projElements = processXMLProjectString(this.fileContent)
      this.$store.commit("project/setDocuments", this.projElements.documents);
      this.$store.commit("project/setQuotations", this.projElements.quotations);
      this.$store.commit("project/setCodes", this.projElements.codes);
      this.$store.commit("project/setCodeGroups", this.projElements.codeGroups);
      this.$store.commit("project/setDocGroups", this.projElements.docGroups);
      this.network = transformAtlasToCyto(this.projElements)
      this.$store.commit("network/setElements", this.network);
    }
  },

};
</script>
