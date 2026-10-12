<script setup lang="ts">
import * as THREE from 'three';
import {onMounted, onUnmounted} from 'vue';
import { shaderOptions, type ShaderOption } from './shaders';
import { createAccentLights } from './effects/accentLights';



interface Sphere {
    sphere: THREE.Mesh;
    shaderOption: ShaderOption;
    x_animation_value: number;
    y_animation_value: number;
    z_animation_value: number;
}


const spheres: Sphere[] = [];
const scene = new THREE.Scene();
const camera = createCamera();
const renderer = createRenderer();
const light = createLight();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();
const accentLights = createAccentLights();
let currentShaderOption: ShaderOption = shaderOptions[0];

document.body.appendChild(renderer.domElement);
defineExpose({
    fadeOut: fadeOutShapeOverNSeconds,
    fadeIn: fadeInShapeOverNSeconds,
    setShader
});

function setShader(id: string) {
    const option = shaderOptions.find(o => o.id === id) ?? shaderOptions[0];
    currentShaderOption = option;
    for (const s of spheres) {
        const material = option.createMaterial(new THREE.Color(0xAAAAAA));
        option.applyAccentLights?.(material, accentLights.accentLights);
        s.sphere.material = material;
        s.sphere.userData.shaderOption = option;
        s.shaderOption = option;
    }
}

function fadeInShapeOverNSeconds(n: number) {
    for (const sphere of spheres) {
        const option = sphere.shaderOption;
        const material = sphere.sphere.material as THREE.Material;
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
    for (const sphere of spheres) {
        const option = sphere.shaderOption;
        const material = sphere.sphere.material as THREE.Material;
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

const points = generatePoints(100);
points.forEach(point => {
    const sphere = createPositionSphere(point.x, point.y, point.z);
    scene.add(sphere);
    spheres.push({
        sphere,
        shaderOption: currentShaderOption,
        x_animation_value: getRandomInRange(0.001, 0.006),
        y_animation_value: getRandomInRange(0.001, 0.006),
        z_animation_value: getRandomInRange(0.001, 0.006),
    });
});

document.addEventListener('mousemove', onMouseMove);
scene.add(light);
scene.add(new THREE.AmbientLight(0xFFFFFF, 0.25));
accentLights.pointLights.forEach(pointLight => scene.add(pointLight));
camera.position.z = 1;

onMounted(() => {
    window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('mousemove', onMouseMove);
});


function createCamera() {
    const fov = window.innerWidth < 600 ? 45 : 75;
    return new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
}

function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    Object.assign(renderer.domElement.style, {
        display: 'block',
        alignContent: 'center',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '-1',
        background: '#242424',
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
}

function createPositionSphere(x: number, y: number, z: number) {
    const geometry = new THREE.SphereGeometry(0.05, 32, 32);
    const material = currentShaderOption.createMaterial(new THREE.Color(0xAAAAAA));
    currentShaderOption.applyAccentLights?.(material, accentLights.accentLights);
    const sphere = new THREE.Mesh(geometry, material);
    sphere.userData.shaderOption = currentShaderOption;
    sphere.position.set(x, y, z);
    sphere.castShadow = true;
    return sphere;
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

function generatePoints(numPoints: number) {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numPoints; i++) {
        const y = 1 - (i / (numPoints - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;
        points.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius });
    }
    return points;
}

function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    const now = clock.getElapsedTime();
    intersects.forEach(intersect => {
        const mesh = intersect.object as THREE.Mesh;
        const option = mesh.userData.shaderOption as ShaderOption | undefined;
        if (!option) return;
        const lastTriggered = (mesh.userData.lastHighlightTime as number | undefined) ?? -Infinity;
        if (now - lastTriggered > 0.5) {
            option.triggerHighlight(mesh.material as THREE.Material);
            mesh.userData.lastHighlightTime = now;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    accentLights.update(elapsed);
    spheres.forEach(sphere => {
        sphere.sphere.rotation.x += sphere.x_animation_value;
        sphere.sphere.rotation.y += sphere.y_animation_value;
        sphere.sphere.rotation.z += sphere.z_animation_value;
        sphere.shaderOption.update(sphere.sphere.material as THREE.Material, elapsed);
    });
    rotateSphereMatrixAroundCamera();
    renderer.render(scene, camera);
}

function rotateSphereMatrixAroundCamera() {
    const matrix = new THREE.Matrix4().makeRotationY(0.003);
    spheres.forEach(sphere => sphere.sphere.applyMatrix4(matrix));
}

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
        background: #242424;
    }
</style>