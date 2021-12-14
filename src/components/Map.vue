<template>
  <amap :zoom="3" :map-style="style"></amap>
</template>

<script>
import Amap from "@amap/amap-vue/lib/amap";

export default {
  components: {
    Amap
  },
  watch: {
    dark_mode() {
      this.style = this.dark_mode
        ? "amap://styles/dark"
        : "amap://styles/whitesmoke";
    },
  },
  data() {
    return {
      style: "amap://styles/whitesmoke",
      dark_mode: this.$vuetify.theme.dark
    };
  },
};
</script>