import * as THREE from 'three';
import type { ShaderOption } from './types';

const vertexShader = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uBaseColor;
uniform float uTime;
uniform float uPhaseOffset;
uniform float uHighlight;
uniform float uOpacity;
uniform vec3 uAccentLightPos[3];
uniform vec3 uAccentLightColor[3];
varying vec3 vNormal;
varying vec3 vWorldPosition;
void main() {
    float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + uPhaseOffset);
    float lightFacing = clamp(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.3, 1.0);
    vec3 color = uBaseColor * (0.4 + pulse * 0.6) * lightFacing;
    for (int i = 0; i < 3; i++) {
        float d = distance(vWorldPosition, uAccentLightPos[i]);
        float atten = 1.0 / (1.0 + d * d * 8.0);
        color += uAccentLightColor[i] * atten;
    }
    color = mix(color, vec3(1.0), uHighlight * 0.8);
    gl_FragColor = vec4(min(color, vec3(1.0)), uOpacity);
}
`;

export const pulseEmissiveShader: ShaderOption = {
    id: 'pulse-emissive',
    label: 'Pulsing Emissive',
    createMaterial(baseColor: THREE.Color) {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
                uBaseColor: { value: baseColor.clone() },
                uTime: { value: 0 },
                uPhaseOffset: { value: Math.random() * Math.PI * 2 },
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
