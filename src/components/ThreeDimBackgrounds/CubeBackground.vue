<script setup lang="ts">
import * as THREE from 'three';
import { shaderOptions, type ShaderOption } from './shaders';
import { createAccentLights } from './effects/accentLights';

const cubes: Cube[] = [];
const scene = new THREE.Scene();
const camera = createCamera();
const renderer = createRenderer();
const light = createLight();
const clock = new THREE.Clock();
const accentLights = createAccentLights();
let currentShaderOption: ShaderOption = shaderOptions[0];

defineExpose({
    fadeOut: fadeOutShapeOverNSeconds,
    fadeIn: fadeInShapeOverNSeconds,
    setShader
});

function setShader(id: string) {
    const option = shaderOptions.find(o => o.id === id) ?? shaderOptions[0];
    currentShaderOption = option;
    for (const c of cubes) {
        const material = option.createMaterial(new THREE.Color(0xAAAAAA));
        option.applyAccentLights?.(material, accentLights.accentLights);
        c.cube.material = material;
        c.cube.userData.shaderOption = option;
        c.shaderOption = option;
    }
}

function fadeInShapeOverNSeconds(n: number) {
    for (const cube of cubes) {
        const option = cube.shaderOption;
        const material = cube.cube.material as THREE.Material;
        let opacity = 0;
        option.setOpacity(material, opacity);
        const opacityStep = 1 / (60 * n);
        const interval = setInterval(() => {
            opacity = Math.min(1, opacity + opacityStep);
            option.setOpacity(material, opacity);
            if (opacity >= 1) {
                clearInterval(interval);
            }
        }, 1000 / 60);
    }
}

function fadeOutShapeOverNSeconds(n: number) {
    for (const cube of cubes) {
        const option = cube.shaderOption;
        const material = cube.cube.material as THREE.Material;
        let opacity = 1;
        option.setOpacity(material, opacity);
        const opacityStep = 1 / (60 * n);
        const interval = setInterval(() => {
            opacity = Math.max(0, opacity - opacityStep);
            option.setOpacity(material, opacity);
            if (opacity <= 0) {
                clearInterval(interval);
            }
        }, 1000 / 60);
    }
}

document.body.appendChild(renderer.domElement);

interface Cube {
    cube: THREE.Mesh;
    shaderOption: ShaderOption;
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
        shaderOption: currentShaderOption,
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
    const now = clock.getElapsedTime();
    for (const intersect of intersects) {
        const mesh = intersect.object as THREE.Mesh;
        const option = mesh.userData.shaderOption as ShaderOption | undefined;
        if (!option) continue;
        const lastTriggered = (mesh.userData.lastHighlightTime as number | undefined) ?? -Infinity;
        if (now - lastTriggered > 0.5) {
            option.triggerHighlight(mesh.material as THREE.Material);
            mesh.userData.lastHighlightTime = now;
        }
    }
});

scene.add(light);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.25);
scene.add(ambientLight);

accentLights.pointLights.forEach(pointLight => scene.add(pointLight));

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
    const material = currentShaderOption.createMaterial(new THREE.Color(0xAAAAAA));
    currentShaderOption.applyAccentLights?.(material, accentLights.accentLights);
    const cube = new THREE.Mesh(geometry, material);
    cube.userData.shaderOption = currentShaderOption;
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
    const elapsed = clock.getElapsedTime();
    accentLights.update(elapsed);
    for (const cube of cubes) {
        animateCube(cube);
        cube.shaderOption.update(cube.cube.material as THREE.Material, elapsed);
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
        background: #242424;
    }
</style>