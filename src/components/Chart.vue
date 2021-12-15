<template>
  <v-tabs v-model="tab" centered show-arrows>
    <v-tabs-slider></v-tabs-slider>
    <v-tab href="#tab-1">Cases</v-tab>
    <v-tab href="#tab-2">Cumulative Cases</v-tab>
    <v-tab href="#tab-3">Deaths</v-tab>
    <v-tab href="#tab-4">Cumulative Deaths</v-tab>
    <v-tabs-items v-model="tab" touchless>
      <v-tab-item value="tab-1">
        <bar-chart :chartData="getData('cases')" :options="options" />
      </v-tab-item>
      <v-tab-item value="tab-2">
        <bar-chart :chartData="getData('cumulative_cases')" :options="options" />
      </v-tab-item>
      <v-tab-item value="tab-3">
        <bar-chart :chartData="getData('deaths')" :options="options" />
      </v-tab-item>
      <v-tab-item value="tab-4">
        <bar-chart :chartData="getData('cumulative_deaths')" :options="options" />
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import { BarChart } from "vue-chart-3";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
Chart.register(zoomPlugin);

export default {
  components: {
    BarChart,
  },
  data() {
    return {
      tab: null,
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                tooltipFormat: "LL",
              },
            },
          ],
        },
        plugins: {
          legend: false,
          decimation: {
            enabled: true,
            algorithm: "min-max",
          },
          zoom: {
            pan: {
              enabled: true,
              mode: "x",
            },
            zoom: {
              wheel: {
                enabled: true,
                speed: 0.2,
              },
              pinch: {
                enabled: true,
              },
              mode: "x",
            },
          },
        },
      },
    };
  },
  props: ["data", "graph_types"],
  methods: {
    getData: function (type) {
      console.log(type)
      let arr = {
        datasets: [
          {
            label: this.graph_types[type].title,
            backgroundColor: this.graph_types[type].color,
            data: [],
          },
        ],
      };
      for (let key in this.data) {
        let data = this.data[key];
        arr.datasets[0].data.push({
          x: this.getTimeFromTimestamp(data.time),
          y: data[type],
        });
      }
      return arr;
    },
    getTimeFromTimestamp: function (time) {
      let date = new Date();
      date.setTime(time * 1000);
      return date.toLocaleDateString();
    },
  },
};
</script>