<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
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
        <v-card>
          <v-card-text>
            <v-tabs v-model="tab" centered show-arrows>
              <v-tabs-slider></v-tabs-slider>
              <v-tab href="#tab-1">Cases</v-tab>
              <v-tab href="#tab-2">Cumulative Cases</v-tab>
              <v-tab href="#tab-3">Deaths</v-tab>
              <v-tab href="#tab-4">Cumulative Deaths</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" touchless>
              <v-tab-item value="tab-1">
                <bar-chart :chartData="getCountryData('cases')" :options="options" />
              </v-tab-item>
              <v-tab-item value="tab-2">
                <bar-chart :chartData="getCountryData('cumulative_cases')" :options="options" />
              </v-tab-item>
              <v-tab-item value="tab-3">
                <bar-chart :chartData="getCountryData('deaths')" :options="options" />
              </v-tab-item>
              <v-tab-item value="tab-4">
                <bar-chart :chartData="getCountryData('cumulative_deaths')" :options="options" />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    </transition>
    <v-overlay opacity="1" :value="!loading">
      <v-card>
          <v-card-title>Network Error</v-card-title>
          <v-card-text>
            <p class="font-weight-bold">Unable to connect to the backend server.</p>
            <p>Check your Internet connection and try refreshing the page.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="refresh">Refresh</v-btn>
          </v-card-actions>
        </v-card>
    </v-overlay>
  </v-container>
</template>

<script>
import config from 'config'
import { BarChart } from "vue-chart-3";
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';
Chart.register(zoomPlugin);

export default {
  components: {
    BarChart
  },
  data() {
    return {
      data: null,
      loading: true,
      search: "",
      tab: null,
      table_headers: [
        { text: "Country", value: "country" },
        { text: "ISO", value: "ISO" },
        { text: "Cases", value: "cases" },
        { text: "Deaths", value: "deaths" },
        { text: "Cumulative Cases", value: "cumulative_cases" },
        { text: "Cumulative Deaths", value: "cumulative_deaths" },
        { text: "Vaccine Doses Administered", value: "total_vaccinated" },
        { text: "Vaccinated At Least One Dose", value: "plus_vaccinated" },
        { text: "Fully Vaccinated", value: "fully_vaccinated" },
      ],
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                tooltipFormat: 'LL'
              },
            },
          ]
        },
        plugins: {
          legend: false,
          decimation: {
            enabled: true,
            algorithm: 'min-max'
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x'
            },
            zoom: {
              wheel: {
                enabled: true,
                speed: 0.2
              },
              pinch: {
                enabled: true
              },
              mode: 'x'
            }
          }
        }
      }
    }
  },
  mounted () {
    this.axios.get(config.server_url + '/country/' + this.$route.params.id).then((response) => (this.data = response.data)).catch(() => (this.loading = false))
  },
  methods: {
    getCountryData: function(type) {
      const color = {
        cases: "#3F51B5",
        cumulative_cases: "#5E35B1",
        deaths: "#FF7043",
        cumulative_deaths: "#E53935"
      }
      var arr = {
        datasets: [{
          label: type.replace(/\b\w+\b/g, word => (word.substring(0,1).toUpperCase() + word.substring(1))),
          backgroundColor: color[type],
          data: [],
        }],
      };
      for (var key in this.data.history) {
        var data = this.data.history[key]
        arr.datasets[0].data.push({
          x: this.getTimeFromTimestamp(data.time),
          y: data[type]
        })
      }
      return arr;
    },
    tableItems: function() {
      var arr = [];
      for (var key in this.data.country) {
        var data = this.data.country[key];
        if (data.plus_vaccinated == null) data.plus_vaccinated = "N/A";
        if (data.fully_vaccinated == null) data.fully_vaccinated = "N/A";
        arr.push(data);
      }
      return arr;
    },
    getTimeFromTimestamp: function(time) {
      var date = new Date()
      date.setTime(time * 1000)
      return date.toLocaleDateString()
    },
    refresh () {
      location.reload();
    }
  },
};
</script>