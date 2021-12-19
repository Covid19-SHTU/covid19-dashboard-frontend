<template>
  <amap :zoom="2" ref="map" :map-style="style" :center="[10, 20]">
    <div v-for="(type, key) in graph_data" :key="key">
      <div v-if="key == map_content">
        <amap-circle-marker
          v-for="(country, dekey) in getCountrys(key)"
          :key="dekey"
          :center="country.location"
          :radius="country.radius"
          :fillOpacity="0.5"
          :strokeWeight="0"
          :fillColor="graph_data[key].color"
        />
      </div>
    </div>
    <v-menu right offset-y open-on-hover transition="slide-y-transition" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" absolute style="right: 10px;top: 10px;">Select Type</v-btn>
      </template>
      <v-list>
        <v-list-item link v-for="(type, key) in graph_data" :key="key" @click="map_content = key">
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
    this.style = this.theme ? "amap://styles/dark" : "amap://styles/whitesmoke";
    // The logo should be removed due to floating above the navigation drawer
    this.removeLogo();
  },
  watch: {
    theme() {
      this.style = this.theme ? "amap://styles/dark" : "amap://styles/whitesmoke";
    }
  },
  props: ["data", "theme"],
  methods: {
    getCountrys: function(type) {
      let result = [];
      let data = [];
      const min_radius = 0.1;
      const geos = require("geos-major");
      for (let key in this.data) {
        data.push(this.data[key][type]);
      }
      data.sort((x, y) => (x - y));
      const resize = this.graph_data[type].max_radius / Math.pow(2, (this.computeLog(data[data.length - 1])));
      for (let key in this.data) {
        const radius_data = this.data[key][type];
        try {
          result.push({
            location: [geos.country(key).longitude, geos.country(key).latitude],
            radius: radius_data ? (Math.pow(2, (this.computeLog(radius_data))) * resize) : min_radius
          });
        } catch {
          console.log("Oops, " + key + " is not found in the datasets!");
        }
      }
      return result;
    },
    computeLog: function(number) {
      return Math.log(number) / Math.log(10)
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
      map_content: "cases",
      graph_data: {
        cases: {
          title: "Cases",
          color: "#3F51B5",
          max_radius: 40
        },
        cumulative_cases: {
          title: "Cumulative Cases",
          color: "#5E35B1",
          max_radius: 60
        },
        deaths: {
          title: "Deaths",
          color: "#FF7043",
          max_radius: 35
        },
        cumulative_deaths: {
          title: "Cumulative Deaths",
          color: "#E53935",
          max_radius: 50
        },
        total_vaccinated: {
          title: "Total Vaccinated",
          color: "#2E7D32",
          max_radius: 60
        },
        plus_vaccinated: {
          title: "At Least One Vaccinated",
          color: "#00897B",
          max_radius: 50
        },
        fully_vaccinated: {
          title: "Fully Vaccinated",
          color: "#8BC34A",
          max_radius: 45
        },
      }
    };
  }
};
</script>