import Vue from "vue";
import VueCytoscape from "vue-cytoscape"
import App from "./App";
import Buefy from 'buefy';
import JsonCSV from "vue-json-csv";
import router from './router'
import store from './store'

Vue.use(VueCytoscape);
Vue.use(Buefy);

Vue.component('downloadCsv', JsonCSV)

new Vue({
  render: h => h(App),
  router,
  store,
  devtool: 'source-map'
}).$mount("#app");