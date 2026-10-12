import * as THREE from 'three';

export interface AccentLight {
    position: THREE.Vector3;
    color: THREE.Color;
}

export interface AccentLightsOptions {
    count?: number;
    radius?: number;
    colors?: number[];
    intensity?: number;
    speed?: number;
}

export interface AccentLights {
    pointLights: THREE.PointLight[];
    accentLights: AccentLight[];
    update(elapsedSeconds: number): void;
}

// Small PointLights that drift around the point-cloud cluster, giving moving
// specular highlights/rim-light instead of the single static directional light.
export function createAccentLights(options: AccentLightsOptions = {}): AccentLights {
    const {
        count = 3,
        radius = 1.4,
        colors = [0xff4d6d, 0x4dd2ff, 0xffd24d],
        intensity = 2,
        speed = 0.35,
    } = options;

    const pointLights = Array.from(
        { length: count },
        (_, i) => new THREE.PointLight(colors[i % colors.length], intensity, radius * 5)
    );

    // Same Vector3/Color instances as the lights themselves, so shader uniforms
    // referencing these objects stay in sync without per-frame copying.
    const accentLights: AccentLight[] = pointLights.map(light => ({
        position: light.position,
        color: light.color,
    }));

    function update(elapsedSeconds: number) {
        pointLights.forEach((light, i) => {
            const angle = elapsedSeconds * speed + (i / count) * Math.PI * 2;
            const tilt = (i / count) * Math.PI * 2;
            light.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle * 0.7 + tilt) * radius * 0.7,
                Math.sin(angle) * radius
            );
        });
    }

    return { pointLights, accentLights, update };
}
