<template>
  <v-tabs v-model="tab" centered show-arrows>
    <v-tab :href="`#${key}`" v-for="(item, key) in graph_data" :key="key">{{ item.title }}</v-tab>
    <v-tabs-items v-model="tab" touchless>
      <v-tab-item :value="key" v-for="(item, key) in graph_data" :key="key">
        <bar-chart :chartData="chartData(key)" :options="options" :ref="`chart-${key}`" />
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import { BarChart } from "vue-chart-3";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
import config from "config";
Chart.register(zoomPlugin);

export default {
  components: {
    BarChart
  },
  data() {
    return {
      tab: null,
      data: this.origin_data,
      prediction: [],
      graph_data: {
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
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "time",
            time: {
              tooltipFormat: "LL"
            }
          }
        },
        plugins: {
          legend: false,
          decimation: {
            enabled: true,
            algorithm: "min-max"
          },
          zoom: {
            limits: {
              x: {
                min: "original",
                max: "original",
                minRange: 86400 * 30 * 1000
              }
            },
            pan: {
              enabled: true,
              mode: "x"
            },
            zoom: {
              wheel: {
                enabled: true,
                speed: 0.2
              },
              pinch: {
                enabled: true
              },
              mode: "x"
            }
          }
        }
      }
    };
  },
  props: ["origin_data", "enable_prediction", "loading_prediction"],
  computed: {
    chartData() {
      return function(type) {
        return this.getData(this.data, type);
      };
    }
  },
  watch: {
    enable_prediction() {
      this.enable_prediction ? this.addPrediction() : this.removePrediction();
    },
    tab() {
      this.$emit("update:enable_prediction", false) 
    }
  },
  methods: {
    getData: function(input, type) {
      let arr = {
        datasets: [
          {
            label: this.graph_data[type].title,
            backgroundColor: this.graph_data[type].color,
            data: []
          }
        ]
      };
      for (let key in input) {
        let data = input[key];
        arr.datasets[0].data.push({
          x: this.getTimeFromTimestamp(data.time),
          y: data[type]
        });
      }
      return arr;
    },
    addPrediction: function() {
      const country = this.$route.params.id == undefined ? "ALL" : this.$route.params.id;
      this.$emit("update:loading_prediction", "primary") 
      const min = this.getTimeFromTimestamp([...this.data].slice(-21)[0].time);
      const max = this.getTimeFromTimestamp([...this.data].pop().time + 86400 * 7);
      this.options.plugins.zoom.limits.x.max = max;
      this.axios
        .get(config.server_url + "/predict/" + country)
        .then(response => {
          this.prediction = response.data;
          this.$emit("update:loading_prediction", false) ;
          this.data.push(...this.prediction);
          this.$refs["chart-" + this.tab][0].chartInstance.zoomScale("x", {min: min, max: max}, "default");
        })
        .catch(() => console.log("Oops, something goes wrong!"));
    },
    removePrediction: function() {
      this.data.splice(
        this.data.length - this.prediction.length,
        this.data.length
      );
      const max = this.getTimeFromTimestamp([...this.data].pop().time)
      this.options.plugins.zoom.limits.x.max = max;
    },
    getTimeFromTimestamp: function(time) {
      let date = new Date(time * 1000);
      return date;
    }
  }
};
</script>