import { standardShader } from './standard';
import { fresnelGlowShader } from './fresnelGlow';
import { pulseEmissiveShader } from './pulseEmissive';
import { noisePlasmaShader } from './noisePlasma';
import { iridescentShader } from './iridescent';
import type { ShaderOption } from './types';

export type { ShaderOption };

export const shaderOptions: ShaderOption[] = [
    pulseEmissiveShader,
    standardShader,
    fresnelGlowShader,
    noisePlasmaShader,
    iridescentShader,
];
