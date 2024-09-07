<script setup lang="ts">
    import * as THREE from 'three';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // keep the canvas centered while keeping the aspect ratio
    renderer.domElement.style.display = "block";
    renderer.domElement.style.alignContent = "center";
    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.zIndex = "-1";
    renderer.domElement.style.background = "transparent";
    scene.background = null;
    renderer.domElement.style.color = "white";
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial();
    const cube = new THREE.Mesh(geometry, material);
    cube.geometry.scale(0.5, 0.5, 0.5);
    cube.material.color.set(0xAAAAAA);
    cube.material.wireframe = false;
    cube.material.opacity = 1;
    cube.material.transparent = false;
    cube.castShadow = true;
    scene.add(cube);

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshStandardMaterial({ color: 0xAAAAAA }));
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true;
    // cube casts shadow

    scene.add(plane);

    const light = new THREE.DirectionalLight(0xFFFFFF, 0.75);
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.25);
    scene.add(ambientLight);

    light.position.set(0, 1, 1);
    light.rotation.set(0, 0, 0);
    light.castShadow = true;

    scene.add(light);

    camera.position.z = 2;

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }


    window.addEventListener("resize", onWindowResize);



    const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;
        cube.rotation.z += 0.005;

        renderer.render(scene, camera);
    };

    animate();

</script>

<template>

</template>

<style scoped>
    canvas {
        display: block;
        align-content: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        background: transparent;
        color: white;
    }
</style>