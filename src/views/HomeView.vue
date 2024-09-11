<script setup lang="ts">
// import CubeBackground from "../components/ThreeDimBackgrounds/CubeBackground.vue";
import InfoPlacard from "../components/InfoPlacard.vue";
import BackgroundSelector from "../components/BackgroundSelector.vue";
</script>

<template>
<!--    <CubeBackground />-->
    <InfoPlacard />
    <BackgroundSelector />
</template>

<style scoped>
CubeBackground {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
}
</style>