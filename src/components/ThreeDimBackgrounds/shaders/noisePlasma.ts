import * as THREE from 'three';
import type { ShaderOption } from './types';
import { snoise3D } from './noise';

const vertexShader = `
varying vec3 vPosition;
varying vec3 vWorldPosition;
void main() {
    vPosition = position;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uGlowColor;
uniform float uTime;
uniform float uHighlight;
uniform float uOpacity;
uniform vec3 uAccentLightPos[3];
uniform vec3 uAccentLightColor[3];
varying vec3 vPosition;
varying vec3 vWorldPosition;

${snoise3D}

void main() {
    float n = snoise(vPosition * 6.0 + vec3(0.0, 0.0, uTime * 0.5));
    float t = smoothstep(-0.5, 0.5, n);
    vec3 color = mix(uBaseColor, uGlowColor, t);
    for (int i = 0; i < 3; i++) {
        float d = distance(vWorldPosition, uAccentLightPos[i]);
        float atten = 1.0 / (1.0 + d * d * 8.0);
        color += uAccentLightColor[i] * atten;
    }
    color = mix(color, vec3(1.0), uHighlight * 0.8);
    gl_FragColor = vec4(min(color, vec3(1.0)), uOpacity);
}
`;

export const noisePlasmaShader: ShaderOption = {
    id: 'noise-plasma',
    label: 'Noise Plasma',
    createMaterial(baseColor: THREE.Color) {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
                uBaseColor: { value: baseColor.clone() },
                uGlowColor: { value: new THREE.Color(0xff6633) },
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
