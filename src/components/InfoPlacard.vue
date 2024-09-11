<script setup lang="ts">

import IconLink from "./IconLink.vue";
</script>

<template>
    <div class="container">
        <h1>scott ellis</h1>
        <p>full stack developer</p>

        <div class="info">
            <IconLink link="https://github.com/sellist"
                      icon="/github.svg"
                      title="Github" />
            <IconLink link="https://www.linkedin.com/in/sellist/"
                      icon="/linkedin.svg"
                      title="LinkedIn" />
            <IconLink link="mailto:scottellis94@gmail.com"
                      icon="/mail.svg"
                      title="Email" />
        </div>
        <h6>try mousing over the shapes!</h6>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 20rem;
        width: 20rem;
        margin: auto;
        border-radius: 100%;
        background-color: rgb(66, 66, 66);
    }

    h1 {
        font-size: 3rem;
        margin: 0;
        padding: 0;
        color: white;
    }

    p {
        font-size: 1.5rem;
        margin: 0;
        padding: 0;
        color: white;
    }

    .info {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .info a {
        text-decoration: none;
    }

    .info a:hover {
        transform: scale(1.1);
        transition: all 0.1s ease-in-out;
        color: white;
    }

    .info img {
        width: 2rem;
        height: 2rem;
        margin: 0.5rem;
    }

    h6 {
        font-size: 0.75rem;
        margin: 0;
        padding: 0;
        color: white;
    }


</style>