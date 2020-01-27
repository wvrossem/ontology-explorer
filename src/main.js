import Vue from "vue";
import VueCytoscape from "vue-cytoscape"
import App from "./App";
import { Icon } from "leaflet";
import "leaflet.icon.glyph";

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.use(VueCytoscape);

new Vue({
  render: h => h(App)
}).$mount("#app");