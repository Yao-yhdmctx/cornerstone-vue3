<script setup lang="ts">
import Toolbar from "@/views/Toolbar.vue";
import ListVue from "@/views/List.vue";
import ImagesDisplayVue from "@/views/ImagesDisplay.vue";
</script>

<template >
  <v-layout>
    <v-app-bar height="50" color="#535353" elevation="0">
      <v-app-bar-title
        >
          <v-img
          width="50"
            height="30"
            :src="require('@/assets/img/Radix.png')"
          ></v-img></v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer width="52" color="#535353" permanent
      ><Toolbar></Toolbar
    ></v-navigation-drawer>
    <v-navigation-drawer
      location="right"
      width="240"
      color="grey-lighten-1"
      permanent
      style="border-left: 0"
    >
      <ListVue></ListVue>
    </v-navigation-drawer>
    <v-main
      class="d-flex justify-center align-center flex-1"
      style="
        background-color: #282828;
        box-sizing: border-box;
      "
      width="100%"
      height="100%"
    >
      <ImagesDisplayVue></ImagesDisplayVue>
    </v-main>
  </v-layout>
</template>

<style >
</style>