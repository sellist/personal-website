<template>
    <title>Title!</title>
    <div>
        aaaaaaaaaaaaa
    </div>
    <CubeAnimation class="cube"/>
</template>

<script setup>
import CubeAnimation from '../components/Cube.vue'
</script>

<script>


export default {
    name: "testView"
}
</script>

<style scoped>
    .cube {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>