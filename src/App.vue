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
            <v-icon>mdi-view-dashboard</v-icon>
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
        <router-view class="child-view" :data="data"></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      data: null,
      drawer: true,
      list_items: [
        { title: "Dashboard", link: "/" }
      ]
    }
  },
  mounted () {
    this.axios.get('http://192.168.0.9:9000').then((response) => (this.data = response.data))
  }
};
</script>
