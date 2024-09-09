<script setup lang="ts">
import CubeBackground from "../components/CubeBackground.vue";
import IconLink from "../components/socialLinks/IconLink.vue";
</script>

<template>
<div>
    <h1>scott ellis</h1>
    <p>full stack developer</p>
    <CubeBackground />
    <div class="navbar">
        <IconLink link="https://github.com/sellist"
                  icon="src/assets/github.svg"
                  title="Github" />
        <IconLink link="https://www.linkedin.com/in/sellist/"
                  icon="src/assets/linkedin.svg"
                  title="LinkedIn" />

    </div>
</div>
</template>

<style scoped>
h1 {
    text-align: center;
    margin-top: 2rem;
}

</style>