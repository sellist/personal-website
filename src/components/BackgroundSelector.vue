<script setup lang="ts">
import {ref} from 'vue';
import CubeBackground from './ThreeDimBackgrounds/CubeBackground.vue';
import SphereBackground from './ThreeDimBackgrounds/SphereBackground.vue';

const backgrounds = [CubeBackground, SphereBackground];
const currentIndex = ref(0);

const nextBackground = () => {
    currentIndex.value = (currentIndex.value + 1) % backgrounds.length;
};

const prevBackground = () => {
    currentIndex.value = (currentIndex.value - 1 + backgrounds.length) % backgrounds.length;
};
</script>

<template>
    <div>
        <button type="button" @click="prevBackground"><</button>
        <button type="button" @click="nextBackground">></button>

        <component :is="backgrounds[currentIndex]"  />
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
        cursor: pointer;
    }

    .fade-in {
        opacity: 1;
        transition: opacity 0.5s;
    }

    .fade-out {
        opacity: 0;
        transition: opacity 0.5s;
    }

</style>