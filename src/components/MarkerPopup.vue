<template>
  <l-marker
    :lat-lng="position"
    :title="title"
    :draggable="false"
    @click="$emit('set-location', title)"
  >
    <l-popup 
      :content="text"
    ></l-popup>
  </l-marker>
</template>

<script>
import { LMarker, LPopup } from "vue2-leaflet";

export default {
  name: "MarkerPopup",
  components: {
    LMarker,
    LPopup
  },
  props: {
    text: {
      type: String,
      default: ""
    },
    position: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
