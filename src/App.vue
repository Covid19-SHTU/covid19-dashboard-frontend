<style>
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.child-view {
  position: absolute;
  transition: all .5s cubic-bezier(.5, 0, .1, 1);
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
    </v-app-bar>
    <v-main>
      <transition name="fade">
        <router-view class="child-view"></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import { mdiViewDashboard } from "@mdi/js";

export default {
  name: 'App',
  data() {
    return {
      list_items: [
        { title: "Dashboard", icon: mdiViewDashboard, link: "/" }
      ],
      drawer: true
    }
  }
};
</script>
