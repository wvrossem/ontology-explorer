<template>
  <div class="section" id="about-text">
    <div class="container">
      <div class="column is-10 is-offset-1">
        <h1 class="title">Upload project file</h1>

        <div class="columns">
          <div class="column is-half">
            <h2 class="subtitle">
              1)
              <b-icon icon="export" size="is-small"></b-icon>Export the Atlas.ti project to XML
            </h2>
            <div class="content">
              <p>First you will need to export the complete Atlas.ti project to an XML file using the built in functionality of the software. This export will allow the tool to process the elements using custom methods. The following video gives an example of how to do this on macOS.</p>
              <video autoplay loop muted>
                <source media="(min-width: 640px)" src="@/assets/export_project.mp4" />
              </video>
              <p>
                Read more about the XML file format on the atlas.ti website
                <a
                  href="https://atlasti.com/product/xml/"
                >here</a>.
              </p>
            </div>
          </div>
          <div class="column">
            <h2 class="subtitle">
              2)
              <b-icon icon="upload" size="is-small"></b-icon>Upload the XML file
            </h2>
            <div class="content">
              <p>Next, upload the XML file using the input element below. After the file selected, please click the button. This will read and parse the XML file. The elements in this file in this way will be transformed into a network.</p>
            </div>
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from "@/components/FileUpload.vue";

export default {
  name: "Upload",
  components: {
    FileUpload
  }
};
</script>
