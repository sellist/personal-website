<script setup lang="ts">
import {ref} from 'vue';
import CubeBackground from './ThreeDimBackgrounds/CubeBackground.vue';
import SphereBackground from './ThreeDimBackgrounds/SphereBackground.vue';

const backgrounds = [CubeBackground, SphereBackground];
const currentIndex = ref(0);

const nextBackground = () => {
    const prev = currentIndex.value;
    backgrounds[prev].value.fadeOut(1);
    currentIndex.value = (currentIndex.value + 1) % backgrounds.length;
};

const prevBackground = () => {
    const prev = currentIndex.value;
    backgrounds[prev].exposed.fadeOutShapeOverNSeconds(1);
    currentIndex.value = (currentIndex.value - 1 + backgrounds.length) % backgrounds.length;
};
</script>

<template>
    <div>
        <button type="button" @click="prevBackground"><</button>
        <button type="button" @click="nextBackground">></button>
        <div class="background-cover"></div>
        <component class="background" :is="backgrounds[currentIndex]"  />
    </div>
</template>

<style scoped>
    div {
        display: flex;
        justify-content: center;
    }

    button {
        background-color: rgb(66, 66, 66);
        text-align: center;
        width: 4rem;
        height: 4rem;
        margin: 0.5rem;
        padding: 0.5rem;
        font-size: 1rem;
        border-radius: 100%;
        z-index: 2;
        cursor: pointer;
    }

    .background {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -2;
    }

</style>