import Vue from "vue";
import VueCytoscape from "vue-cytoscape"
import App from "./App";
import Buefy from 'buefy';
import JsonCSV from "vue-json-csv";

Vue.use(VueCytoscape);
Vue.use(Buefy);

Vue.component('downloadCsv', JsonCSV)

new Vue({
  render: h => h(App),
  devtool: 'source-map',
}).$mount("#app");