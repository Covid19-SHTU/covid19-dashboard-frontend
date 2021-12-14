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
          <v-skeleton-loader type="card"></v-skeleton-loader>
          <v-skeleton-loader type="table" class="mt-4"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-else key="view">
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <chart :data="data.history" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </transition>
    <overlay :loading="loading" />
  </v-container>
</template>

<script>
import Overlay from "../components/Overlay.vue";
import Chart from "../components/Chart.vue";
import config from "config";

export default {
  components: {
    Overlay,
    Chart
  },
  data() {
    return {
      data: null,
      loading: true,
      search: ""
    };
  },
  mounted() {
    this.axios
      .get(config.server_url + "/country/" + this.$route.params.id)
      .then(response => (this.data = response.data))
      .catch(() => (this.loading = false));
  }
};
</script>