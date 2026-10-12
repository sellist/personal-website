import * as THREE from 'three';
import type { ShaderOption } from './types';

const vertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform float uTime;
uniform float uHighlight;
uniform float uOpacity;
uniform vec3 uAccentLightPos[3];
uniform vec3 uAccentLightColor[3];
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    float facing = clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0.0, 1.0);
    float hue = fract(facing * 0.6 + uTime * 0.05);
    vec3 color = hsv2rgb(vec3(hue, 0.65, 1.0));
    for (int i = 0; i < 3; i++) {
        float d = distance(vWorldPosition, uAccentLightPos[i]);
        float atten = 1.0 / (1.0 + d * d * 8.0);
        color += uAccentLightColor[i] * atten;
    }
    color = mix(color, vec3(1.0), uHighlight * 0.8);
    gl_FragColor = vec4(min(color, vec3(1.0)), uOpacity);
}
`;

export const iridescentShader: ShaderOption = {
    id: 'iridescent',
    label: 'Iridescent',
    createMaterial() {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uHighlight: { value: 0 },
                uOpacity: { value: 1 },
                uAccentLightPos: { value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
                uAccentLightColor: { value: [new THREE.Color(0, 0, 0), new THREE.Color(0, 0, 0), new THREE.Color(0, 0, 0)] },
            },
        });
    },
    update(material, elapsedSeconds) {
        const uniforms = (material as THREE.ShaderMaterial).uniforms;
        uniforms.uTime.value = elapsedSeconds;
        if (uniforms.uHighlight.value > 0) {
            uniforms.uHighlight.value = Math.max(0, uniforms.uHighlight.value - 0.02);
        }
    },
    triggerHighlight(material) {
        (material as THREE.ShaderMaterial).uniforms.uHighlight.value = 1;
    },
    setOpacity(material, opacity) {
        (material as THREE.ShaderMaterial).uniforms.uOpacity.value = opacity;
    },
    applyAccentLights(material, lights) {
        const uniforms = (material as THREE.ShaderMaterial).uniforms;
        const positions = uniforms.uAccentLightPos.value as THREE.Vector3[];
        const colors = uniforms.uAccentLightColor.value as THREE.Color[];
        lights.forEach((light, i) => {
            positions[i] = light.position;
            colors[i] = light.color;
        });
    },
};
