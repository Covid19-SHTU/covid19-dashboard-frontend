<template>
  <amap :zoom="2" ref="map" :map-style="style" :center="[10, 20]">
    <div v-for="(type, key) in graph_types" :key="key">
      <div v-if="key == map_content">
        <amap-circle-marker
          v-for="(country, dekey) in getCountrys(key)"
          :key="dekey"
          :center="country.location"
          :radius="country.radius"
          :fillOpacity="0.2"
          :strokeWeight="0"
          :fillColor="graph_types[key].color"
        />
      </div>
    </div>
    <v-menu right offset-y open-on-hover transition="slide-y-transition" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" absolute style="right: 10px;top: 10px;">Select Type</v-btn>
      </template>
      <v-list>
        <v-list-item link v-for="(type, key) in graph_types" :key="key" @click="map_content = key">
          <v-list-item-title>{{ type.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </amap>
</template>

<script>
import Amap from "@amap/amap-vue/lib/amap";
import AmapCircleMarker from "@amap/amap-vue/lib/circle-marker";

export default {
  components: {
    Amap,
    AmapCircleMarker
  },
  created() {
    this.style = this.$vuetify.theme.dark
      ? "amap://styles/dark"
      : "amap://styles/whitesmoke";
    // The logo should be removed due to floating above the navigation drawer
    this.removeLogo();
  },
  props: ["data", "graph_types"],
  methods: {
    getCountrys: function(type) {
      let result = [];
      let data = [];
      let middle = 0;
      const min_radius = 0.1;
      const geos = require("geos-major");
      for (let key in this.data) {
        data.push(this.data[key][type]);
      }
      data.sort((x, y) => (x - y));
      middle = data[Math.floor(data.length / 2)] ? data[Math.floor(data.length / 2)] : 1;
      const enlarge = 20 / (Math.log(data[data.length - 1] / middle) - Math.log(data.filter((item) => (item))[0] / middle));
      for (let key in this.data) {
        const radius_data = this.data[key][type];
        try {
          result.push({
            location: [geos.country(key).longitude, geos.country(key).latitude],
            radius: radius_data ? (Math.log(this.data[key][type] / middle) - Math.log(data.filter((item) => (item))[0] / middle)) * enlarge : min_radius
          });
        } catch {
          console.log("Oops, " + key + " is not found in the datasets!");
        }
      }
      return result;
    },
    removeLogo: function() {
      new Promise(resolve => setTimeout(resolve, 100)).then(() => {
        try {
          if (!this.logo_removed) {
            document.getElementsByClassName("amap-logo")[0].remove();
            document.getElementsByClassName("amap-copyright")[0].remove();
            this.logo_removed = true;
          }
        } catch {
          this.removeLogo();
        }
      });
    }
  },
  data() {
    return {
      style: null,
      logo_removed: false,
      map_content: "cases"
    };
  }
};
</script>