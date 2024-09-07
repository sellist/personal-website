<script setup lang="ts">

</script>

<template>
    <nav>
        <button>
            <router-link to="/">Home</router-link>
        </button>

    </nav>
</template>

<style scoped>
nav {
    display: flex;
    justify-content: space-around;
    padding: 1rem;
    background-color: #f1f1f1;
    border-bottom: 1px solid #ccc;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

nav button {
    text-decoration: none;
    background-color: #ddd;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.5rem 1rem;
}

nav button:hover {
    transition: all 0.1s ease-in-out;
    background-color: dodgerblue;
}

nav button:active {
    background-color: #ccc;
}

nav button:focus {
    outline: none;
}

</style>