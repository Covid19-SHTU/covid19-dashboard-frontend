<template>
  <v-container v-if="this.$attrs.data">
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Global Statistics</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <p class="text-button">New Cases</p>
                <p class="text-h4">{{ this.$attrs.data.world.cases }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p class="text-button">Confirmed Cases</p>
                <p class="text-h4">
                  {{ this.$attrs.data.world.cumulative_cases }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="text-button">New Deaths</p>
                <p class="text-h4">{{ this.$attrs.data.world.deaths }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p class="text-button">Confirmed Deaths</p>
                <p class="text-h4">
                  {{ this.$attrs.data.world.cumulative_deaths }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="text-button">Vaccine Doses Administered</p>
                <p class="text-h4">{{ this.$attrs.data.world.total_vaccinated }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p class="text-button">Vaccinated At Least One Dose</p>
                <p class="text-h4">
                  {{ this.$attrs.data.world.plus_vaccinated }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="text-button">Fully Vaccinated</p>
                <p class="text-h4">{{ this.$attrs.data.world.fully_vaccinated }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p class="text-button">Last Update</p>
                <p class="text-h4">
                  {{ getTimeFromTimestamp(this.$attrs.data.world.update) }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-text>
            <v-tabs v-model="tab" centered>
              <v-tabs-slider></v-tabs-slider>
              <v-tab href="#tab-1">Cases</v-tab>
              <v-tab href="#tab-2">Cumulative Cases</v-tab>
              <v-tab href="#tab-3">Deaths</v-tab>
              <v-tab href="#tab-4">Cumulative Deaths</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item value="tab-1">
                <bar-chart :chartData="worldDeathData('cases', 'daily')" :options="options" />
              </v-tab-item>
              <v-tab-item value="tab-2">
                <bar-chart :chartData="worldDeathData('cases', 'cumulative')" :options="options" />
              </v-tab-item>
              <v-tab-item value="tab-3">
                <bar-chart :chartData="worldDeathData('deaths', 'daily')" :options="options" />
              </v-tab-item>
              <v-tab-item value="tab-4">
                <bar-chart :chartData="worldDeathData('deaths', 'cumulative')" :options="options" />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>
            Summary Data
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search by Country" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table :headers="table_headers" :items="tableItems()" :search="search"></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { BarChart } from "vue-chart-3";
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
Chart.register();

export default {
  components: {
    BarChart
  },
  data() {
    return {
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
      },
    }
  },
  methods: {
    worldDeathData: function(type, way) {
      const color = {
        cases: {daily: "#3F51B5", cumulative: "#5E35B1"},
        deaths: {daily: "#FF7043", cumulative: "#E53935"},
      }
      var arr = {
        datasets: [{
          label: type.slice(0, 1).toUpperCase() + type.slice(1),
          backgroundColor: color[type][way],
          data: [],
        }],
      };
      for (var key in this.$attrs.data.world.history[way]) {
        var data = this.$attrs.data.world.history[way][key];
        arr.datasets[0].data.push({
          x: this.getTimeFromTimestamp(data.time),
          y: data[type]
        })
      }
      return arr;
    },
    tableItems: function() {
      var arr = [];
      for (var key in this.$attrs.data.country) {
        var data = this.$attrs.data.country[key];
        if (data.plus_vaccinated == null) data.plus_vaccinated = "N/A";
        if (data.fully_vaccinated == null) data.fully_vaccinated = "N/A";
        arr.push(data);
      }
      return arr;
    },
    getTimeFromTimestamp: function(time) {
      var date = new Date();
      date.setTime(time * 1000);
      return date.toLocaleDateString()
    }
  },
};
</script>