<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
        link: String,
        icon: String,
        alt: String,
        title: String
    });
</script>

<template>
    <a :href="link" :title="title">
        <img :src="icon" :alt="alt" />
    </a>
</template>

<style scoped>
    img {
        width: 2rem;
        height: 2rem;
        margin: 0.5rem;
    }

    img:hover {
        transform: scale(1.1);
        transition: all 0.1s ease-in-out;
        color: white;
    }

</style>