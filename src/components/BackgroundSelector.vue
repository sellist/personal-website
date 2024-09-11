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
        <transition name="fade" mode="out-in">
            <component class="background" :is="backgrounds[currentIndex]" :key="currentIndex"></component>
        </transition>
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

    .background {
        transition: all 0.5s ease-in-out;
    }

</style>