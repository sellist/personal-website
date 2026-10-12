import * as THREE from 'three';
import type { ShaderOption } from './types';

// Preserves the original lit MeshStandardMaterial look as the default option.
export const standardShader: ShaderOption = {
    id: 'standard',
    label: 'Standard',
    createMaterial(baseColor: THREE.Color) {
        return new THREE.MeshStandardMaterial({ color: baseColor.clone() });
    },
    update() {
        // lit material has no per-frame uniforms to animate
    },
    triggerHighlight(material) {
        (material as THREE.MeshStandardMaterial).color = new THREE.Color(
            Math.random(), Math.random(), Math.random()
        );
    },
    setOpacity(material, opacity) {
        const standardMaterial = material as THREE.MeshStandardMaterial;
        standardMaterial.transparent = true;
        standardMaterial.opacity = opacity;
    },
};
