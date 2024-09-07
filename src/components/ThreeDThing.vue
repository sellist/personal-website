<script setup lang="ts">

import { onMounted } from 'vue';

onMounted(() => {
    const canvas = document.getElementById('cool-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.fillStyle = 'red';

    ctx.fillRect(10, 10, 100, 100);

});

</script>

<template>
    <p>Here is a red square while this site is built:</p>
    <div>
        <canvas id="cool-canvas"></canvas>
    </div>
    <p>enjoy!</p>
</template>

<style scoped>

</style>