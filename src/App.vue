<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

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
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mdiEarth, mdiChartAreaspline, mdiCog } from "@mdi/js";

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
  data() {
    return {
      drawer: null,
      loading: true,
      list_items: [
        { title: "Dashboard", icon: mdiEarth, link: "/" },
        { title: "Country", icon: mdiChartAreaspline, link: "/country/US" }
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
    }
  }
};
</script>
