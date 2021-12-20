<template>
  <radar-chart :chartData="getData()" :options="options" ref="chart" />
</template>

<script>
import { RadarChart } from "vue-chart-3";
import Chart from "chart.js/auto";
export default {
  components: {
    RadarChart
  },
  data() {
    return {
      data: this.origin_data,
      options: {
        responsive: true,
        plugins: {
          legend: false
        }
      }
    };
  },
  props: ["origin_data"],
  created() {
    Chart.defaults.borderColor = "rgba(128, 128, 128, 0.5)"
    Chart.defaults.scales.radialLinear.pointLabels.color = "rgb(128, 128, 128)"
    Chart.defaults.scales.radialLinear.ticks.color = "rgb(128, 128, 128)"
    Chart.defaults.scales.radialLinear.ticks.backdropColor = 'transparent';
  },
  methods: {
    getData: function() {
      let arr = {
        labels: [],
        datasets: [
          {
            borderColor: "#FDD83590",
            backgroundColor: "#FDD83590",
            data: []
          }
        ]
      };
      for (let key in this.data) {
        let data = this.data[key];
        arr.labels.push(key.slice(0, 1).toUpperCase() + key.slice(1));
        arr.datasets[0].data.push(data);
      }
      return arr;
    }
  }
};
</script>