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
        v-bind:disabled="!dropFiles">
        <b-icon icon="progress-wrench" size="is-small"></b-icon>
        <span>Upload and transform</span>
      </b-button>
    </div>

    <div class="level" v-if="fileContentPreview">
      <b-message title="File content preview" type="is-success" has-icon >
        {{ fileContentPreview }}
      </b-message>
    </div>
  </section>
</template>

<script>
import { isEmpty } from "lodash";

export default {
  data() {
    return {
      dropFiles: [],
      fileContent: null,
      fileContentPreview: null,
      isUploadInProgress: false
    };
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
      }
      reader.onerror = (e) => {
        this.$buefy.toast.open({
            duration: 5000,
            message: 'Error occurred reading file',
            type: 'is-danger'
        })
        this.isUploadInProgress = false;
      }
      this.fileContent = reader.readAsText(file);
    }
  },

};
</script>
