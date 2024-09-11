<script setup lang="ts">
import * as THREE from 'three';

const cubes: Cube[] = [];
const scene = new THREE.Scene();
const camera = createCamera();
const renderer = createRenderer();
const light = createLight();

document.body.appendChild(renderer.domElement);

interface Cube {
    cube: THREE.Mesh;
    x_animation_value: number;
    y_animation_value: number;
    z_animation_value: number;
}

const points = [];
const numPoints = 100;
const phi = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < numPoints; i++) {
    const y = 1 - (i / (numPoints - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    points.push({ x, y, z });
}

for (const point of points) {
    const cube = createPositionCube(point.x, point.y, point.z);
    scene.add(cube);
    const c: Cube = {
        cube: cube,
        x_animation_value: getRandomInRange(0.001, 0.006),
        y_animation_value: getRandomInRange(0.001, 0.006),
        z_animation_value: getRandomInRange(0.001, 0.006),
    };
    cubes.push(c);
}

// use raycast to detect mouse over cube
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
document.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    for (const intersect of intersects) {
        const cube = intersect.object as THREE.Mesh;
        if (cube.material instanceof THREE.MeshStandardMaterial) {
            if (cube.material.color.getHex() === 0xAAAAAA) {
                addRandomFadingColorToCube(cube);
            }
        }
    }
});

function addRandomFadingColorToCube(cube: THREE.Mesh) {
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    cube.material = new THREE.MeshStandardMaterial({color: color});
}

scene.add(light);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.25);
scene.add(ambientLight);

camera.position.z = 1;

window.addEventListener("resize", onWindowResize);

animate();

function createCamera() {
    return new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
}

function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.alignContent = "center";
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.zIndex = "-1";
    renderer.domElement.style.background = "#242424";
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
}

function createPositionCube(x: number,y: number,z:number) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = Math.random() * 2 * Math.PI;
    cube.geometry.scale(0.1, 0.1, 0.1);
    cube.position.set(x,y,z);
    cube.castShadow = true;
    return cube;
}

function getRandomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function createLight() {
    const light = new THREE.DirectionalLight(0xFFFFFF, 0.75);
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    light.position.set(0, 1, 1);
    light.castShadow = true;
    return light;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animateCube(c: Cube) {
    c.cube.rotation.x += c.x_animation_value;
    c.cube.rotation.y += c.y_animation_value;
    c.cube.rotation.z += c.z_animation_value;
}

function animate() {
    requestAnimationFrame(animate);
    for (const cube of cubes) {
        animateCube(cube);
    }
    renderer.render(scene, camera);
}

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
        background: #242424;
    }
</style>