<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list nav dense>
        <v-list-item v-for="item in list_items" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer></v-spacer>
      <v-btn icon @click="initSettings" @click.stop="settings.dialog = true">
        <v-icon>{{ settings.icon }}</v-icon>
      </v-btn>
      <v-dialog v-model="settings.dialog" max-width="600px">
        <v-card>
          <v-card-title>设置</v-card-title>
          <v-card-text>
            <v-container>
              <v-form>
                <v-select v-model="settings.theme.value" :items="settings.theme.items" label="主题"></v-select>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="settings.dialog = false">取消</v-btn>
            <v-btn color="primary" text @click="saveSettings">保存</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <v-main>
      <router-view :data="data" v-if="alive"></router-view>
    </v-main>
    <v-overlay opacity="1" :value="!this.data">
      <v-progress-circular v-if="loading" indeterminate color="primary" width="6" size="64"></v-progress-circular>
      <v-card v-if="!loading">
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
  </v-app>
</template>

<script>
import { mdiViewDashboard, mdiCog } from "@mdi/js";

export default {
  name: 'App',
  created() {
    try {
      this.$vuetify.theme.dark = this.settings.theme.value;
      document.body.removeChild(document.getElementById("app-loader"));
    } catch {
      console.log("Have a nice day!");
    }
  },
  mounted () {
    this.axios.get('http://127.0.0.1:9000').then((response) => (this.data = response.data)).catch(() => (this.loading = false))
  },
  data() {
    return {
      data: null,
      drawer: null,
      loading: true,
      alive: true,
      list_items: [
        { title: "Dashboard", icon: mdiViewDashboard, link: "/" }
      ],
      settings: {
        icon: mdiCog,
        dialog: false,
        theme: {
          value: window.matchMedia('(prefers-color-scheme: dark)').matches,
          items: [
            { text: "亮色", value: false },
            { text: "暗色", value: true }
          ]
        }
      }
    }
  },
  methods: {
    initSettings () {
      this.settings.theme.value = this.$vuetify.theme.dark;
    },
    saveSettings () {
      this.$vuetify.theme.dark = this.settings.theme.value;
      this.settings.dialog = false;
    },
    refresh () {
      location.reload();
    }
  }
};
</script>
