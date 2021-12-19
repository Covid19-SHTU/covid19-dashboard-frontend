<template>
  <v-container>
    <transition name="fade" mode="out-in">
      <v-row v-if="!data" key="skeleton">
        <v-col cols="12">
          <v-skeleton-loader type="card"></v-skeleton-loader>
          <v-skeleton-loader type="table" class="mt-4"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-else key="view">
        <v-col cols="12">
          <v-autocomplete
            v-model="country"
            :items="data.country_list"
            item-text="name"
            item-value="ISO"
            label="Choose a country to see its data"
            hide-no-data
            hide-details
            solo
            rounded
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="8">
          <v-row>
            <v-col cols="12" md="6" v-for="(item, key) in graph_data" :key="key">
              <v-card :color="item.color" dark>
                <v-card-text>
                  <v-row no-gutters class="white--text">
                    <v-col cols="6">
                      <div class="text-button">{{ item.title }}</div>
                      <p class="text-h4 font-weight-bold">{{ getDataOfDays(key, 1).value }}</p>
                      <div class="text-caption font-weight-bold">
                        <v-icon dense>{{ getDataOfDays(key, 1).icon }}</v-icon>
                        {{ getDataOfDays(key, 1).ratio }}
                      </div>
                    </v-col>
                    <v-col cols="6" align-self="center" class="text-right">
                      <div class="text-caption font-weight-bold">7 days:</div>
                      <div class="text-h6 font-weight-bold">{{ getDataOfDays(key, 7).value }}</div>
                      <div class="text-caption">
                        <v-icon dense>{{ getDataOfDays(key, 7).icon }}</v-icon>
                        {{ getDataOfDays(key, 7).ratio }}
                      </div>
                      <div v-if="enable_prediction" class="text-caption font-weight-bold">(With prediction)</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
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
                        :disabled="Boolean(loading_prediction)"
                        :loading="loading_prediction"
                      ></v-switch>
                    </v-list-item-avatar>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card>
                <v-card-title class="pb-0">Vaccination Data</v-card-title>
                <v-list two-line>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-subtitle>Vaccine Doses Administered</v-list-item-subtitle>
                      <v-list-item-title class="text-h5 font-weight-bold">{{ data.total_vaccinated }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-subtitle>Vaccinated At Least One Dose</v-list-item-subtitle>
                      <v-list-item-title class="text-h5 font-weight-bold">{{ data.plus_vaccinated }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-subtitle>Fully Vaccinated</v-list-item-subtitle>
                      <v-list-item-title class="text-h5 font-weight-bold">{{ data.fully_vaccinated }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3">
          <v-card>
            <v-card-title class="pb-0">
              Measures
              <v-spacer></v-spacer>
              <v-chip :color="measure_chip.color">{{ measure_chip.text }}</v-chip>
            </v-card-title>
            <v-card-text>
              <RadarChart :origin_data="data.phsm_data" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="9">
          <v-card>
            <v-card-text>
              <BarChart
                :origin_data="data.history"
                :enable_prediction.sync="enable_prediction"
                :loading_prediction.sync="loading_prediction"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </transition>
    <Overlay :loading="loading" />
  </v-container>
</template>

<script>
import Overlay from "../components/Overlay.vue";
import BarChart from "../components/charts/BarChart.vue";
import RadarChart from "../components/charts/RadarChart.vue";
import config from "config";
import { mdiMenuUp, mdiMenuDown } from "@mdi/js";

export default {
  components: {
    Overlay,
    BarChart,
    RadarChart
  },
  data() {
    return {
      data: null,
      loading: true,
      country: null,
      loading_prediction: false,
      enable_prediction: false,
      graph_data: {
        cases: {
          title: "Cases",
          color: "#3F51B5"
        },
        deaths: {
          title: "Deaths",
          color: "#FF7043"
        },
        cumulative_cases: {
          title: "Cumulative Cases",
          color: "#5E35B1"
        },
        cumulative_deaths: {
          title: "Cumulative Deaths",
          color: "#E53935"
        }
      }
    }
  },
  props: ["theme"],
  computed: {
    measure_chip() {
      if (this.data.phsm_ratio <= 35) {
        return {color: "green", text: "Loose"}
      }
      else if (this.data.phsm_ratio > 35 && this.data.phsm_ratio <= 60) {
        return {color: "primary", text: "Normal"}
      }
      else {
        return {color: "red", text: "Tense"}
      }
    }
  },
  watch: {
    country: function() {
      if (this.country != this.$route.params.id) {
        this.enable_prediction = false
        this.$router.push({ path: `/country/${this.country}` });
        this.fetchData();
      }
    }
  },
  mounted() {
    this.country = this.$route.params.id;
    this.fetchData();
  },
  methods: {
    getDataOfDays: function(type, days) {
      const data = this.data.history;
      let origin = 0;
      let compare = 0;
      for (let index = 0; index < days; index++) {
        origin += data[data.length - index - 1][type];
        compare += data[data.length - index - days - 1][type];
      }
      const ratio = ((origin - compare) / compare) * 100;
      return {
        value: origin,
        ratio: ratio.toFixed(2) + "%",
        icon: ratio > 1 ? mdiMenuUp : mdiMenuDown
      };
    },
    fetchData() {
      this.data = null;
      this.axios
        .get(config.server_url + "/country/" + this.$route.params.id)
        .then(response => (this.data = response.data))
        .catch(() => (this.loading = false));
    }
  }
};
</script>