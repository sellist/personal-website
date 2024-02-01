<template>
  <router-view></router-view>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
  name: 'App',
  components: {
    RouterView
}
}
</script>

<style>
  @import "./styles/global.css";

  *,*::before,*::after{
    margin: 0;
    padding:0;
  }
  
</style>
