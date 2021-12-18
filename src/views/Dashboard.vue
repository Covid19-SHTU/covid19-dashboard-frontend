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
            <Map :data="data.country" />
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Show prediction</v-list-item-title>
                    <v-list-item-avatar>
                      <v-switch
                        v-model="enable_prediction"
                        hide-details
                        class="mt-0"
                        :loading="loading_prediction"
                      ></v-switch>
                    </v-list-item-avatar>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card>
                <v-card-title>Global Statistics</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="6" v-for="(item, key) in statistics_data" :key="key">
                      <p class="text-caption font-weight-bold">{{ item }}</p>
                      <div class="text-h5 font-weight-bold">{{ key == "last_update" ? getTimeFromTimestamp(data.world.update) : data.world[key] }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-text>
              <Chart
                :origin_data="data.world.history"
                :enable_prediction.sync="enable_prediction"
                :loading_prediction.sync="loading_prediction"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
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
      enable_prediction: false,
      loading_prediction: false,
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
      statistics_data: {
        cases: "New Cases",
        cumulative_cases: "New Cases",
        deaths: "New Cases",
        cumulative_deaths: "New Cases",
        total_vaccinated: "Vaccine Doses Administered",
        plus_vaccinated: "Vaccinated At Least One Dose",
        fully_vaccinated: "Fully Vaccinated",
        last_update: "Last Update"
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
      let date = new Date(time * 1000);
      return date.toLocaleDateString();
    }
  }
};
</script>