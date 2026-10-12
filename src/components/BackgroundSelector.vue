<script setup lang="ts">
import {ref, nextTick} from 'vue';
import CubeBackground from './ThreeDimBackgrounds/CubeBackground.vue';
import SphereBackground from './ThreeDimBackgrounds/SphereBackground.vue';
import { shaderOptions } from './ThreeDimBackgrounds/shaders';

const backgrounds = [CubeBackground, SphereBackground];
const currentIndex = ref(0);
const currentShaderId = ref(shaderOptions[0].id);
const backgroundRef = ref<InstanceType<typeof CubeBackground> | InstanceType<typeof SphereBackground> | null>(null);
const fadeSpeed = 0.2;

const nextBackground = () => {
    backgroundRef.value?.fadeOut(fadeSpeed);
    currentIndex.value = (currentIndex.value + 1) % backgrounds.length;
    nextTick(() => {
        backgroundRef.value?.setShader(currentShaderId.value);
        backgroundRef.value?.fadeIn(fadeSpeed);
    });
};

const prevBackground = () => {
    backgroundRef.value?.fadeOut(fadeSpeed);
    currentIndex.value = (currentIndex.value - 1 + backgrounds.length) % backgrounds.length;
    nextTick(() => {
        backgroundRef.value?.setShader(currentShaderId.value);
        backgroundRef.value?.fadeIn(fadeSpeed);
    });
};

const onShaderChange = (event: Event) => {
    currentShaderId.value = (event.target as HTMLSelectElement).value;
    backgroundRef.value?.setShader(currentShaderId.value);
};
</script>

<template>
    <div>
        <button type="button" @click="prevBackground"><</button>
        <button type="button" @click="nextBackground">></button>
        <select class="shader-select" :value="currentShaderId" @change="onShaderChange">
            <option v-for="option in shaderOptions" :key="option.id" :value="option.id">
                {{ option.label }}
            </option>
        </select>
        <div class="background-cover"></div>
        <component class="background" :is="backgrounds[currentIndex]" ref="backgroundRef" />
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

    .shader-select {
        background-color: rgb(66, 66, 66);
        color: white;
        align-self: center;
        margin: 0.5rem;
        padding: 0.5rem;
        font-size: 1rem;
        border-radius: 0.5rem;
        border: none;
        z-index: 2;
        cursor: pointer;
    }

</style>