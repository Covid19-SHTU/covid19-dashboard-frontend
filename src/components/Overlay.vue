<template>
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
</template>

<script>
export default {
  props: ["loading"],
  methods: {
    refresh() {
      location.reload();
    },
  },
};
</script>