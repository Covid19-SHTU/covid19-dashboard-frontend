<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <v-container>
    <transition name="fade" mode="out-in">
      <v-row v-if="!data" key="skeleton">
        <v-col cols="12">
          <v-skeleton-loader type="image"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="4">
          <v-skeleton-loader type="date-picker"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="8">
          <v-skeleton-loader type="card"></v-skeleton-loader>
          <v-skeleton-loader type="table" class="mt-4"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-else key="view">
        <v-col cols="12">
          <v-card height="500">
            <Map :data="data.country" :graph_types="graph_types" />
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Global Statistics</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <p class="text-button">New Cases</p>
                  <p class="text-h4">{{ data.world.cases }}</p>
                </v-col>
                <v-col cols="12" md="6">
                  <p class="text-button">Confirmed Cases</p>
                  <p class="text-h4">{{ data.world.cumulative_cases }}</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <p class="text-button">New Deaths</p>
                  <p class="text-h4">{{ data.world.deaths }}</p>
                </v-col>
                <v-col cols="12" md="6">
                  <p class="text-button">Confirmed Deaths</p>
                  <p class="text-h4">{{ data.world.cumulative_deaths }}</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <p class="text-button">Vaccine Doses Administered</p>
                  <p class="text-h4">{{ data.world.total_vaccinated }}</p>
                </v-col>
                <v-col cols="12" md="6">
                  <p class="text-button">Vaccinated At Least One Dose</p>
                  <p class="text-h4">{{ data.world.plus_vaccinated }}</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <p class="text-button">Fully Vaccinated</p>
                  <p class="text-h4">{{ data.world.fully_vaccinated }}</p>
                </v-col>
                <v-col cols="12" md="6">
                  <p class="text-button">Last Update</p>
                  <p class="text-h4">{{ getTimeFromTimestamp(data.world.update) }}</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-text>
              <Chart :data="data.world.history" :graph_types="graph_types" />
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-title>
              Summary Data
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search by Country"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="table_headers"
              :items="tableItems()"
              :search="search"
              sort-by="cumulative_cases"
              multi-sort
              sort-desc
              :items-per-page="5"
              :footer-props="{itemsPerPageOptions: [5, 10, 15]}"
            ></v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </transition>
    <Overlay :loading="loading" />
  </v-container>
</template>

<script>
import Overlay from "../components/Overlay.vue";
import Chart from "../components/Chart.vue";
import Map from "../components/Map.vue";
import config from "config";

export default {
  components: {
    Overlay,
    Chart,
    Map
  },
  data() {
    return {
      data: null,
      loading: true,
      search: "",
      table_headers: [
        { text: "Country", value: "country" },
        { text: "ISO", value: "ISO" },
        { text: "Cases", value: "cases" },
        { text: "Deaths", value: "deaths" },
        { text: "Cumulative Cases", value: "cumulative_cases" },
        { text: "Cumulative Deaths", value: "cumulative_deaths" },
        { text: "Vaccine Doses Administered", value: "total_vaccinated" },
        { text: "Vaccinated At Least One Dose", value: "plus_vaccinated" },
        { text: "Fully Vaccinated", value: "fully_vaccinated" }
      ],
      graph_types: {
        cases: {
          title: "Cases",
          color: "#3F51B5"
        },
        cumulative_cases: {
          title: "Cumulative Cases",
          color: "#5E35B1"
        },
        deaths: {
          title: "Deaths",
          color: "#FF7043"
        },
        cumulative_deaths: {
          title: "Cumulative Deaths",
          color: "#E53935"
        }
      }
    };
  },
  mounted() {
    this.axios
      .get(config.server_url)
      .then(response => (this.data = response.data))
      .catch(() => (this.loading = false));
  },
  methods: {
    tableItems: function() {
      let arr = [];
      for (let key in this.data.country) {
        let data = this.data.country[key];
        if (data.plus_vaccinated == null) data.plus_vaccinated = "N/A";
        if (data.fully_vaccinated == null) data.fully_vaccinated = "N/A";
        arr.push(data);
      }
      return arr;
    },
    getTimeFromTimestamp: function(time) {
      let date = new Date();
      date.setTime(time * 1000);
      return date.toLocaleDateString();
    }
  }
};
</script>