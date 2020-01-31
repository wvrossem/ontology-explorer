<template>
  <div>
    <l-map
      :zoom="zoom"
      :center="center"
      style="height: 700px"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <marker-popup
        :position="marker"
        :text="text"
        :title="title"
        v-on:set-location="onSetLocation"
      />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
import { latLng } from "leaflet";
import MarkerPopup from "./MarkerPopup";
export default {
  name: "MarkerPopupExample",
  components: {
    LMap,
    LTileLayer,
    MarkerPopup
  },
  methods: {
    onSetLocation: function (location) {
      this.$emit('set-location', location)
    }
  },
  data() {
    return {
      zoom: 6,
      center: latLng(37.9841493, 23.7279843),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: latLng(41.521647879517, 26.253697872162),
      text: "<h3>Fylakio</h3><p>Fylakio pre-removal centre.</p><p>Available ontology:</p><ul><li><a>XKA</a></li></ul>",
      title: "Fylakio"
    };
  }
};
</script>