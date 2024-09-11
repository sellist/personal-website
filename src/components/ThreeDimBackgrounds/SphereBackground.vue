<script setup lang="ts">
import * as THREE from 'three';

const spheres: Sphere[] = [];
const scene = new THREE.Scene();
const camera = createCamera();
const renderer = createRenderer();
const light = createLight();

document.body.appendChild(renderer.domElement);

interface Sphere {
    sphere: THREE.Mesh;
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
    const sphere = createPositionSphere(point.x, point.y, point.z);
    scene.add(sphere);
    const c: Sphere = {
        sphere: sphere,
        x_animation_value: getRandomInRange(0.001, 0.006),
        y_animation_value: getRandomInRange(0.001, 0.006),
        z_animation_value: getRandomInRange(0.001, 0.006),
    };
    spheres.push(c);
}

// use raycast to detect mouse over sphere
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
document.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    for (const intersect of intersects) {
        const sphere = intersect.object as THREE.Mesh;
        if (sphere.material instanceof THREE.MeshStandardMaterial) {
            if (sphere.material.color.getHex() === 0xAAAAAA) {
                addRandomFadingColorToSphere(sphere);
            }
        }
    }
});

function addRandomFadingColorToSphere(sphere: THREE.Mesh) {
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    sphere.material = new THREE.MeshStandardMaterial({color: color});
}

scene.add(light);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.25);
scene.add(ambientLight);

camera.position.z = 1;

window.addEventListener("resize", onWindowResize);


function createCamera() {
    // fov based on window size
    const fov = window.innerWidth < 600 ? 45 : 75;
    return new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
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

function createPositionSphere(x: number,y: number,z:number) {
    const geometry = new THREE.SphereGeometry(0.05, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    sphere.castShadow = true;
    sphere.receiveShadow = false;
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

function animate() {
    requestAnimationFrame(animate);
    for (const sphere of spheres) {
        sphere.sphere.rotation.x += sphere.x_animation_value;
        sphere.sphere.rotation.y += sphere.y_animation_value;
        sphere.sphere.rotation.z += sphere.z_animation_value;
    }
    rotateSphereMatrixAroundCamera();
    renderer.render(scene, camera);
}

function rotateSphereMatrixAroundCamera() {
    const matrix = new THREE.Matrix4();
    matrix.makeRotationY(0.003);
    for (const sphere of spheres) {
        sphere.sphere.applyMatrix4(matrix);
    }

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
        z-index: -1;
        background: #242424;
    }
</style>