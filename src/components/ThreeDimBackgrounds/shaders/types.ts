import * as THREE from 'three';
import type { AccentLight } from '../effects/accentLights';

// Common contract so CubeBackground/SphereBackground can swap materials interchangeably.
export interface ShaderOption {
    id: string;
    label: string;
    createMaterial(baseColor: THREE.Color): THREE.Material;
    update(material: THREE.Material, elapsedSeconds: number): void;
    triggerHighlight(material: THREE.Material): void;
    setOpacity(material: THREE.Material, opacity: number): void;
    applyAccentLights?(material: THREE.Material, lights: AccentLight[]): void;
}
