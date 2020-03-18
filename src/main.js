import Vue from "vue";
import VueCytoscape from "vue-cytoscape"
import App from "./App";
import Buefy from 'buefy';

Vue.use(VueCytoscape);
Vue.use(Buefy);

new Vue({
  render: h => h(App),
  devtool: 'source-map',
}).$mount("#app");