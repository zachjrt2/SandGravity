// Advanced Interactive Multi-Material Radial Sand & Fluid Engine for Gravity Wars
// High-Performance Real-Time Terrain-Based Gravitational Mass Field Engine

export const MAT = {
    AIR: 0,
    BEDROCK: 1,    // Dense mantle rock
    ROCK: 2,       // Solid crust & stone
    SAND: 3,       // Loose regolith / sand (slides down slopes)
    LAVA: 4,       // Molten magma (hot liquid, burns combustibles, creates obsidian on water)
    WATER: 5,      // Flowing fluid (extinguishes fire, cools lava to obsidian + steam)
    ICE: 6,        // Crystalline ice (melts near heat/lava/fire into water)
    ACID: 7,       // Corrosive chemical fluid (melts rock, sand, ice into toxic vapor)
    OIL: 8,        // Flammable dark fuel (floats, ignites into blazes)
    FIRE: 9,       // Blazing plasma/flame (burns combustibles, melts ice, creates smoke)
    GUNPOWDER: 10, // Highly explosive powder (slides like sand; detonates on contact with heat)
    OBSIDIAN: 11,  // Ultra-hard volcanic glass (formed from Lava + Water)
    GRAVITITE: 12, // Exotic anti-gravity dust (density < 0, exerts repulsive gravity!)
    STEAM: 13,     // Rising vapor / smoke (drifts outward and disperses)
    DIRT: 14,      // Rich surface soil
    CRYSTAL: 15    // Dense mineral deposits
};

export const MATERIAL_DENSITY = {
    [MAT.AIR]: 0.0,
    [MAT.BEDROCK]: 2.2, // Dense mantle rock
    [MAT.ROCK]: 1.5,    // Solid stone
    [MAT.SAND]: 1.0,    // Loose soil/regolith
    [MAT.LAVA]: 1.8,    // Dense molten magma
    [MAT.WATER]: 0.9,   // Fluid
    [MAT.ICE]: 0.8,     // Ice
    [MAT.ACID]: 1.0,    // Chemical fluid
    [MAT.OIL]: 0.75,    // Light fuel
    [MAT.FIRE]: 0.0,    // Plasma
    [MAT.GUNPOWDER]: 1.1,
    [MAT.OBSIDIAN]: 2.4, // High density volcanic glass
    [MAT.GRAVITITE]: -2.0, // Exotic anti-gravity dust!
    [MAT.STEAM]: 0.0,
    [MAT.DIRT]: 1.1,
    [MAT.CRYSTAL]: 2.1
};

// Convert hex string to 32-bit ABGR format
function hexToAbgr(hex, alpha = 255) {
    if (hex.startsWith('#')) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        } else if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        return (alpha << 24) | (b << 16) | (g << 8) | r;
    }
    return (alpha << 24) | (200 << 16) | (200 << 8) | 200;
}

function blendAbgr(abgr1, abgr2, factor) {
    const r1 = abgr1 & 0xff, g1 = (abgr1 >> 8) & 0xff, b1 = (abgr1 >> 16) & 0xff;
    const r2 = abgr2 & 0xff, g2 = (abgr2 >> 8) & 0xff, b2 = (abgr2 >> 16) & 0xff;
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    return (255 << 24) | (b << 16) | (g << 8) | r;
}

export class PlanetTerrain {
    constructor(planet, radius, config = {}) {
        this.planet = planet;
        this.radius = radius;
        this.type = config.type || 'rocky';
        this.color1 = config.color1 || '#4a752c';
        this.color2 = config.color2 || '#2e491b';

        // Grid resolution
        this.gridSize = Math.max(160, Math.min(320, Math.round(radius * 2.0)));
        if (this.gridSize % 2 !== 0) this.gridSize++;

        this.cx = this.gridSize / 2;
        this.cy = this.gridSize / 2;
        this.scale = (radius * 2.2) / this.gridSize; // World units per cell

        this.data = new Uint8Array(this.gridSize * this.gridSize);
        this.colors = new Uint32Array(this.gridSize * this.gridSize);
        this.life = new Uint8Array(this.gridSize * this.gridSize);

        // Raycast surface altitude cache (360 degrees)
        this.surfaceAngles = new Float32Array(360);

        // Spatial mass distribution grid (12x12 coarse blocks for blisteringly fast gravity)
        this.massBlockSize = 12;
        this.numBlocksX = Math.ceil(this.gridSize / this.massBlockSize);
        this.numBlocksY = Math.ceil(this.gridSize / this.massBlockSize);
        this.blockCount = this.numBlocksX * this.numBlocksY;
        this.blockMasses = new Float32Array(this.blockCount);
        this.blockCmX = new Float32Array(this.blockCount);
        this.blockCmY = new Float32Array(this.blockCount);
        this.activeBlockIndices = [];
        this.totalTerrainMass = 0;
        this.centerOfMass = { x: this.planet.x, y: this.planet.y };

        // Offscreen canvas for fast hardware blitting
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.gridSize;
        this.canvas.height = this.gridSize;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.imgData = this.ctx.createImageData(this.gridSize, this.gridSize);
        this.buf32 = new Uint32Array(this.imgData.data.buffer);

        this.isDirty = true;
        this.hasActiveParticles = true;
        this.simTickAccumulator = 0;
        this.animPhase = 0;

        this.initPalette();
        this.generateTerrain();
        this.recomputeMassDistribution();
        this.updateSurfaceCache();
        this.renderToCanvas();
    }

    initPalette() {
        const c1 = hexToAbgr(this.color1);
        const c2 = hexToAbgr(this.color2);

        this.palettes = {
            air: 0x00000000,
            bedrock: hexToAbgr('#1a1f2c'),
            rock1: c2,
            rock2: c1,
            sand: blendAbgr(c1, hexToAbgr('#f59e0b'), 0.45),
            dirt: hexToAbgr('#5c3d28'),
            lava: hexToAbgr('#ff3b00'),
            lavaHot: hexToAbgr('#ffaa00'),
            water: hexToAbgr('#0284c7', 220),
            waterShallow: hexToAbgr('#38bdf8', 230),
            ice: hexToAbgr('#e0f2fe'),
            acid: hexToAbgr('#22c55e', 240),
            acidGlow: hexToAbgr('#86efac', 255),
            oil: hexToAbgr('#1e1b2e'),
            fire: hexToAbgr('#ff2200'),
            fireHot: hexToAbgr('#ffdd00'),
            gunpowder: hexToAbgr('#334155'),
            obsidian: hexToAbgr('#181124'),
            gravitite: hexToAbgr('#00f0ff'),
            steam: hexToAbgr('#e2e8f0', 160),
            crystal: hexToAbgr('#c084fc')
        };
    }

    generateTerrain() {
        const cx = this.cx;
        const cy = this.cy;
        const baseGridR = (this.radius / this.scale);

        const seed = Math.random() * 1000;
        const isIcy = this.color1.includes('67e8f9') || this.color1.includes('38bdf8') || this.type === 'ice';
        const isVolcanic = this.type === 'lava' || this.color1.includes('ef4444') || this.color1.includes('f97316');
        const isToxic = this.type === 'crystal' || this.color1.includes('a855f7');

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const idx = y * this.gridSize + x;
                const dx = x - cx;
                const dy = y - cy;
                const dist = Math.hypot(dx, dy);
                const angle = Math.atan2(dy, dx);

                // Organic planetary crust contouring
                const mountain = Math.sin(angle * 5 + seed) * (baseGridR * 0.05) +
                                 Math.sin(angle * 12 + seed * 2) * (baseGridR * 0.025) +
                                 Math.cos(angle * 24 + seed * 3) * (baseGridR * 0.015);
                const surfaceR = baseGridR + mountain;

                if (dist <= surfaceR) {
                    const depthFromSurface = surfaceR - dist;
                    const normDepth = dist / surfaceR;

                    // Geological vein noise
                    const veinNoise = Math.sin(x * 0.15 + seed) * Math.cos(y * 0.15 + seed);

                    if (isVolcanic) {
                        if (depthFromSurface < 3) {
                            this.data[idx] = MAT.SAND;
                            this.colors[idx] = hexToAbgr('#7c2d12');
                        } else if (veinNoise > 0.62 && depthFromSurface > 6) {
                            this.data[idx] = MAT.LAVA;
                            this.colors[idx] = this.palettes.lava;
                        } else if (veinNoise < -0.55 || depthFromSurface > baseGridR * 0.6) {
                            this.data[idx] = MAT.OBSIDIAN;
                            this.colors[idx] = this.palettes.obsidian;
                        } else {
                            this.data[idx] = MAT.ROCK;
                            this.colors[idx] = blendAbgr(this.palettes.rock2, this.palettes.rock1, Math.random() * 0.5);
                        }
                    } else if (isIcy) {
                        if (depthFromSurface < 5) {
                            this.data[idx] = MAT.ICE;
                            this.colors[idx] = this.palettes.ice;
                        } else if (veinNoise > 0.52 && depthFromSurface > 8) {
                            this.data[idx] = MAT.WATER;
                            this.colors[idx] = this.palettes.water;
                        } else if (veinNoise < -0.58) {
                            this.data[idx] = MAT.CRYSTAL;
                            this.colors[idx] = this.palettes.crystal;
                        } else {
                            this.data[idx] = MAT.ROCK;
                            this.colors[idx] = this.palettes.rock1;
                        }
                    } else if (isToxic) {
                        if (depthFromSurface < 4) {
                            if (veinNoise > 0.38) {
                                this.data[idx] = MAT.GRAVITITE;
                                this.colors[idx] = this.palettes.gravitite;
                            } else {
                                this.data[idx] = MAT.CRYSTAL;
                                this.colors[idx] = this.palettes.crystal;
                            }
                        } else if (veinNoise > 0.62 && depthFromSurface > 6) {
                            this.data[idx] = MAT.ACID;
                            this.colors[idx] = this.palettes.acid;
                        } else {
                            this.data[idx] = MAT.ROCK;
                            this.colors[idx] = this.palettes.rock1;
                        }
                    } else {
                        if (depthFromSurface < 4) {
                            if (Math.random() < 0.35) {
                                this.data[idx] = MAT.SAND;
                                this.colors[idx] = this.palettes.sand;
                            } else {
                                this.data[idx] = MAT.DIRT;
                                this.colors[idx] = this.palettes.dirt;
                            }
                        } else if (veinNoise > 0.72) {
                            this.data[idx] = MAT.GUNPOWDER;
                            this.colors[idx] = this.palettes.gunpowder;
                        } else if (veinNoise < -0.72) {
                            this.data[idx] = MAT.OIL;
                            this.colors[idx] = this.palettes.oil;
                        } else if (veinNoise > 0.6 && depthFromSurface > 14) {
                            this.data[idx] = MAT.CRYSTAL;
                            this.colors[idx] = this.palettes.crystal;
                        } else {
                            this.data[idx] = MAT.ROCK;
                            this.colors[idx] = blendAbgr(this.palettes.rock2, this.palettes.rock1, 1 - normDepth);
                        }
                    }
                } else {
                    this.data[idx] = MAT.AIR;
                    this.colors[idx] = this.palettes.air;
                }
            }
        }
    }

    /**
     * Compute spatial mass blocks and dynamic center of mass from actual terrain voxels
     */
    recomputeMassDistribution() {
        let totalMass = 0;
        let sumWeightedX = 0;
        let sumWeightedY = 0;
        this.activeBlockIndices = [];

        const bs = this.massBlockSize;
        const nbX = this.numBlocksX;
        const nbY = this.numBlocksY;
        const size = this.gridSize;

        for (let by = 0; by < nbY; by++) {
            for (let bx = 0; bx < nbX; bx++) {
                const bIdx = by * nbX + bx;
                let bMass = 0;
                let bSumX = 0;
                let bSumY = 0;

                const startY = by * bs;
                const endY = Math.min(size, startY + bs);
                const startX = bx * bs;
                const endX = Math.min(size, startX + bs);

                for (let y = startY; y < endY; y++) {
                    const row = y * size;
                    for (let x = startX; x < endX; x++) {
                        const mat = this.data[row + x];
                        if (mat !== MAT.AIR) {
                            const density = MATERIAL_DENSITY[mat] !== undefined ? MATERIAL_DENSITY[mat] : 1.0;
                            bMass += density;
                            bSumX += x * density;
                            bSumY += y * density;
                        }
                    }
                }

                this.blockMasses[bIdx] = bMass;
                if (Math.abs(bMass) > 0.05) {
                    this.blockCmX[bIdx] = bSumX / bMass;
                    this.blockCmY[bIdx] = bSumY / bMass;
                    this.activeBlockIndices.push(bIdx);
                    totalMass += bMass;
                    sumWeightedX += bSumX;
                    sumWeightedY += bSumY;
                } else {
                    this.blockCmX[bIdx] = (startX + endX) * 0.5;
                    this.blockCmY[bIdx] = (startY + endY) * 0.5;
                }
            }
        }

        // Calibrate total mass to match standard planetary artillery physics
        const massScaleFactor = (this.scale ** 2) * 0.0055;
        this.totalTerrainMass = totalMass * massScaleFactor;

        if (Math.abs(totalMass) > 0.01) {
            const localAvgX = sumWeightedX / totalMass;
            const localAvgY = sumWeightedY / totalMass;
            this.centerOfMass.x = this.planet.x + (localAvgX - this.cx) * this.scale;
            this.centerOfMass.y = this.planet.y + (localAvgY - this.cy) * this.scale;
        } else {
            this.centerOfMass.x = this.planet.x;
            this.centerOfMass.y = this.planet.y;
        }

        this.planet.mass = this.totalTerrainMass;
        this.planet.targetMass = this.totalTerrainMass;
    }

    /**
     * Ultra-Optimized Terrain-Based Gravitational Vector (Solid 60 FPS)
     * Automatically uses O(1) monopole when outside near-crust zone, and active block sum when inside.
     */
    getGravitationalForceAt(wx, wy, gravFactor = 1.0) {
        if (Math.abs(this.totalTerrainMass) < 0.1) return { fx: 0, fy: 0 };

        const dxToCM = this.centerOfMass.x - wx;
        const dyToCM = this.centerOfMass.y - wy;
        const distSqToCM = dxToCM * dxToCM + dyToCM * dyToCM;
        const distToCM = Math.sqrt(distSqToCM);

        // Fast O(1) Monopole path for all objects outside near-surface zone
        if (distToCM > this.radius * 1.35) {
            const force = (this.totalTerrainMass * 38000 * gravFactor) / (distSqToCM + 1200);
            return {
                fx: (dxToCM / (distToCM || 1)) * force,
                fy: (dyToCM / (distToCM || 1)) * force
            };
        }

        // Close-range multi-block field (tunnels, caves, craters, irregular asteroid chunks)
        let fx = 0;
        let fy = 0;
        const massScaleFactor = (this.scale ** 2) * 0.0055;
        const G = 38000 * gravFactor * massScaleFactor;

        const active = this.activeBlockIndices;
        const activeLen = active.length;
        for (let i = 0; i < activeLen; i++) {
            const bIdx = active[i];
            const m = this.blockMasses[bIdx];

            const bWorldX = this.planet.x + (this.blockCmX[bIdx] - this.cx) * this.scale;
            const bWorldY = this.planet.y + (this.blockCmY[bIdx] - this.cy) * this.scale;

            const bdx = bWorldX - wx;
            const bdy = bWorldY - wy;
            const bdistSq = bdx * bdx + bdy * bdy;
            const bdist = Math.sqrt(bdistSq);

            const bForce = (m * G) / (bdistSq + 1200);
            fx += (bdx / (bdist || 1)) * bForce;
            fy += (bdy / (bdist || 1)) * bForce;
        }

        return { fx, fy };
    }

    worldToLocal(wx, wy) {
        const dx = wx - this.planet.x;
        const dy = wy - this.planet.y;
        return {
            x: Math.round(this.cx + dx / this.scale),
            y: Math.round(this.cy + dy / this.scale)
        };
    }

    localToWorld(lx, ly) {
        return {
            x: this.planet.x + (lx - this.cx) * this.scale,
            y: this.planet.y + (ly - this.cy) * this.scale
        };
    }

    getMat(lx, ly) {
        if (lx < 0 || lx >= this.gridSize || ly < 0 || ly >= this.gridSize) return MAT.AIR;
        return this.data[ly * this.gridSize + lx];
    }

    setMat(lx, ly, mat, color = null) {
        if (lx < 0 || lx >= this.gridSize || ly < 0 || ly >= this.gridSize) return;
        const idx = ly * this.gridSize + lx;

        this.data[idx] = mat;
        if (color) {
            this.colors[idx] = color;
        } else {
            this.colors[idx] = this.getDefaultColor(mat);
        }
        if (mat === MAT.FIRE) this.life[idx] = 8 + Math.floor(Math.random() * 8);
        if (mat === MAT.STEAM) this.life[idx] = 14 + Math.floor(Math.random() * 10);

        this.isDirty = true;
        this.hasActiveParticles = true;
    }

    getDefaultColor(mat) {
        switch (mat) {
            case MAT.AIR: return this.palettes.air;
            case MAT.BEDROCK: return this.palettes.bedrock;
            case MAT.ROCK: return this.palettes.rock1;
            case MAT.SAND: return this.palettes.sand;
            case MAT.LAVA: return this.palettes.lava;
            case MAT.WATER: return this.palettes.water;
            case MAT.ICE: return this.palettes.ice;
            case MAT.ACID: return this.palettes.acid;
            case MAT.OIL: return this.palettes.oil;
            case MAT.FIRE: return this.palettes.fire;
            case MAT.GUNPOWDER: return this.palettes.gunpowder;
            case MAT.OBSIDIAN: return this.palettes.obsidian;
            case MAT.GRAVITITE: return this.palettes.gravitite;
            case MAT.STEAM: return this.palettes.steam;
            case MAT.DIRT: return this.palettes.dirt;
            case MAT.CRYSTAL: return this.palettes.crystal;
            default: return this.palettes.sand;
        }
    }

    getMatAtWorld(wx, wy) {
        const { x, y } = this.worldToLocal(wx, wy);
        return this.getMat(x, y);
    }

    isSolidAtWorld(wx, wy) {
        const mat = this.getMatAtWorld(wx, wy);
        return mat !== MAT.AIR && mat !== MAT.FIRE && mat !== MAT.STEAM;
    }

    getSurfaceRadiusAtAngle(angle) {
        let normAngle = angle % (Math.PI * 2);
        if (normAngle < 0) normAngle += Math.PI * 2;
        const degIdx = Math.floor((normAngle / (Math.PI * 2)) * 360) % 360;

        const cached = this.surfaceAngles[degIdx];
        if (cached > 0) return cached;

        const maxDist = this.cx - 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        for (let r = maxDist; r >= 4; r -= 1) {
            const lx = Math.round(this.cx + cos * r);
            const ly = Math.round(this.cy + sin * r);
            const mat = this.getMat(lx, ly);
            if (mat !== MAT.AIR && mat !== MAT.FIRE && mat !== MAT.STEAM) {
                const worldR = r * this.scale;
                this.surfaceAngles[degIdx] = worldR;
                return worldR;
            }
        }
        return Math.max(10, this.radius * 0.2);
    }

    updateSurfaceCache() {
        const maxDist = this.cx - 2;
        for (let deg = 0; deg < 360; deg++) {
            const angle = (deg / 360) * (Math.PI * 2);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            let found = false;

            for (let r = maxDist; r >= 4; r -= 1) {
                const lx = Math.round(this.cx + cos * r);
                const ly = Math.round(this.cy + sin * r);
                const mat = this.getMat(lx, ly);
                if (mat !== MAT.AIR && mat !== MAT.FIRE && mat !== MAT.STEAM) {
                    this.surfaceAngles[deg] = r * this.scale;
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.surfaceAngles[deg] = Math.max(10, this.radius * 0.2);
            }
        }
    }

    sprayMaterial(wx, wy, mat, radius = 6) {
        const { x: lx, y: ly } = this.worldToLocal(wx, wy);
        const rSq = radius * radius;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (dx * dx + dy * dy <= rSq) {
                    const px = lx + dx;
                    const py = ly + dy;
                    if (px >= 1 && px < this.gridSize - 1 && py >= 1 && py < this.gridSize - 1) {
                        this.setMat(px, py, mat);
                    }
                }
            }
        }
        this.isDirty = true;
        this.hasActiveParticles = true;
        this.updateSurfaceCache();
        this.recomputeMassDistribution();
    }

    carveExplosion(impactX, impactY, blastRadius, options = {}, game = null) {
        const { x: localHitX, y: localHitY } = this.worldToLocal(impactX, impactY);
        const radiusInCells = blastRadius / this.scale;

        const isMagma = options.isMagma || false;
        const vaporizeRatio = options.vaporizeRatio !== undefined ? options.vaporizeRatio : 0.65;
        const pushPower = options.pushPower !== undefined ? options.pushPower : 1.0;

        const vaporizeR = Math.max(2, radiusInCells * vaporizeRatio);
        const vaporizeRSq = vaporizeR * vaporizeR;

        const fractureR = Math.max(vaporizeR, radiusInCells * 1.35);
        const fractureRSq = fractureR * fractureR;

        let modified = false;

        const minX = Math.max(1, localHitX - fractureR);
        const maxX = Math.min(this.gridSize - 2, localHitX + fractureR);
        const minY = Math.max(1, localHitY - fractureR);
        const maxY = Math.min(this.gridSize - 2, localHitY + fractureR);

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const idx = y * this.gridSize + x;
                const mat = this.data[idx];
                if (mat === MAT.AIR) continue;

                const dx = x - localHitX;
                const dy = y - localHitY;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                if (distSq <= vaporizeRSq) {
                    if (mat === MAT.GUNPOWDER) {
                        this.data[idx] = MAT.FIRE;
                        this.colors[idx] = this.palettes.fireHot;
                        this.life[idx] = 12;
                    } else if (mat === MAT.OIL) {
                        this.data[idx] = MAT.FIRE;
                        this.colors[idx] = this.palettes.fire;
                        this.life[idx] = 15;
                    } else if (isMagma && Math.random() < 0.25) {
                        this.data[idx] = MAT.LAVA;
                        this.colors[idx] = this.palettes.lava;
                    } else {
                        this.data[idx] = MAT.AIR;
                        this.colors[idx] = this.palettes.air;
                    }
                    modified = true;
                } else if (distSq <= fractureRSq) {
                    const shockwaveFactor = (1 - dist / fractureR) * pushPower;

                    if (mat === MAT.ROCK || mat === MAT.BEDROCK || mat === MAT.DIRT || mat === MAT.OBSIDIAN) {
                        this.data[idx] = isMagma ? MAT.LAVA : MAT.SAND;
                        this.colors[idx] = isMagma ? this.palettes.lava : this.palettes.sand;
                        modified = true;
                    } else if (mat === MAT.ICE) {
                        this.data[idx] = isMagma ? MAT.STEAM : MAT.WATER;
                        this.colors[idx] = isMagma ? this.palettes.steam : this.palettes.water;
                        modified = true;
                    }

                    if (pushPower > 0.6 && Math.random() < (0.08 * shockwaveFactor)) {
                        if (game && game.particles && typeof game.particles.spawnOrbitalGrain === 'function') {
                            const curMat = this.data[idx];
                            if (curMat !== MAT.AIR) {
                                const px = this.planet.x + (x - this.cx) * this.scale;
                                const py = this.planet.y + (y - this.cy) * this.scale;
                                const pushSpeed = (120 + Math.random() * 160) * pushPower;
                                const normDx = dx / (dist || 1);
                                const normDy = dy / (dist || 1);

                                game.particles.spawnOrbitalGrain(
                                    px, py,
                                    normDx * pushSpeed + (Math.random() - 0.5) * 40,
                                    normDy * pushSpeed + (Math.random() - 0.5) * 40,
                                    this.colors[idx],
                                    curMat,
                                    this.planet
                                );

                                this.data[idx] = MAT.AIR;
                                this.colors[idx] = this.palettes.air;
                                modified = true;
                            }
                        }
                    }
                }
            }
        }

        if (modified) {
            this.isDirty = true;
            this.hasActiveParticles = true;
            this.updateSurfaceCache();
            this.recomputeMassDistribution();
        }
    }

    /**
     * Ultra-Fast O(1) Cellular Automata Simulation Step:
     * Blistering 60 FPS performance with dynamic center of mass attraction
     */
    stepSimulation(game = null) {
        if (!this.hasActiveParticles) return;

        let movedCount = 0;
        const cx = this.cx;
        const cy = this.cy;
        const size = this.gridSize;

        this.animPhase += 0.1;

        // Find nearby celestial bodies whose gravity field reaches this planet
        const nearbyPlanets = (game && game.planets) ? game.planets.filter(p => p !== this.planet && !p.isDead && Math.hypot(p.x - this.planet.x, p.y - this.planet.y) < p.gravityRadius + this.radius * 1.8) : [];
        const hasNearby = nearbyPlanets.length > 0;

        const flipX = Math.random() > 0.5;
        const flipY = Math.random() > 0.5;
        const startX = flipX ? size - 2 : 1;
        const endX = flipX ? 1 : size - 2;
        const stepXDir = flipX ? -1 : 1;

        const startY = flipY ? size - 2 : 1;
        const endY = flipY ? 1 : size - 2;
        const stepYDir = flipY ? -1 : 1;

        for (let y = startY; y !== endY; y += stepYDir) {
            for (let x = startX; x !== endX; x += stepXDir) {
                const idx = y * size + x;
                const mat = this.data[idx];

                if (mat === MAT.AIR || mat === MAT.ROCK || mat === MAT.BEDROCK || mat === MAT.OBSIDIAN) {
                    continue;
                }

                // --- 1. FIRE LOGIC ---
                if (mat === MAT.FIRE) {
                    this.life[idx]--;
                    if (this.life[idx] <= 0) {
                        this.data[idx] = Math.random() < 0.3 ? MAT.STEAM : MAT.AIR;
                        this.colors[idx] = this.palettes.steam;
                        movedCount++;
                        continue;
                    }
                    this.colors[idx] = Math.random() < 0.5 ? this.palettes.fire : this.palettes.fireHot;
                    this.checkFireNeighbors(x, y);
                    movedCount++;
                    continue;
                }

                // --- 2. STEAM / VAPOR LOGIC ---
                if (mat === MAT.STEAM) {
                    this.life[idx]--;
                    if (this.life[idx] <= 0) {
                        this.data[idx] = MAT.AIR;
                        this.colors[idx] = this.palettes.air;
                        movedCount++;
                        continue;
                    }
                    const riseX = Math.sign(x - cx);
                    const riseY = Math.sign(y - cy);
                    const riseIdx = (y + riseY) * size + (x + riseX);
                    if (this.data[riseIdx] === MAT.AIR) {
                        this.swap(x, y, x + riseX, y + riseY);
                        movedCount++;
                    }
                    continue;
                }

                // --- 3. HIGH SPEED LOCAL TERRAIN GRAVITY (O(1)) ---
                let netGx = cx - x;
                let netGy = cy - y;

                let strongestOther = null;
                let strongestPull = 0;

                if (hasNearby) {
                    const wx = this.planet.x + (x - cx) * this.scale;
                    const wy = this.planet.y + (y - cy) * this.scale;

                    for (let pIdx = 0; pIdx < nearbyPlanets.length; pIdx++) {
                        const op = nearbyPlanets[pIdx];
                        const odx = op.x - wx;
                        const ody = op.y - wy;
                        const odistSq = odx * odx + ody * ody;

                        if (odistSq < (op.gravityRadius * op.gravityRadius)) {
                            const odist = Math.sqrt(odistSq);
                            const oforce = (op.mass * 24000) / (odistSq + 600);
                            netGx += (odx / odist) * oforce * 0.05;
                            netGy += (ody / odist) * oforce * 0.05;

                            if (oforce > strongestPull) {
                                strongestPull = oforce;
                                strongestOther = op;
                            }
                        }
                    }

                    // Tidal Siphoning check
                    if (strongestOther && strongestPull > 80 && Math.hypot(x - cx, y - cy) > (this.radius / this.scale) * 0.75) {
                        if (game && game.particles && typeof game.particles.spawnOrbitalGrain === 'function' && Math.random() < 0.15) {
                            const angleToOther = Math.atan2(strongestOther.y - wy, strongestOther.x - wx);
                            const siphonSpeed = 70 + Math.random() * 90;
                            const svx = Math.cos(angleToOther) * siphonSpeed;
                            const svy = Math.sin(angleToOther) * siphonSpeed;

                            game.particles.spawnOrbitalGrain(wx, wy, svx, svy, this.colors[idx], mat, this.planet);
                            this.data[idx] = MAT.AIR;
                            this.colors[idx] = this.palettes.air;
                            movedCount++;
                            continue;
                        }
                    }
                }

                // Step direction toward net gravity
                let stepX = Math.sign(netGx);
                let stepY = Math.sign(netGy);

                // --- 4. GRAVITITE LOGIC (Anti-Gravity Dust) ---
                if (mat === MAT.GRAVITITE) {
                    stepX = -stepX;
                    stepY = -stepY;
                }

                const perp1X = -stepY;
                const perp1Y = stepX;
                const perp2X = stepY;
                const perp2Y = -stepX;

                // --- 5. CHEMICAL REACTIONS ---
                if (this.checkReactions(x, y, mat)) {
                    movedCount++;
                    continue;
                }

                // --- 6. CELLULAR AUTOMATA MOVEMENT ---
                const targetIdx = (y + stepY) * size + (x + stepX);
                const targetMat = this.data[targetIdx];

                if (targetMat === MAT.AIR) {
                    this.swap(x, y, x + stepX, y + stepY);
                    movedCount++;
                } else if (this.isLiquid(mat) && targetMat !== MAT.AIR && !this.isLiquid(targetMat)) {
                    const rDir = Math.random() > 0.5 ? 1 : -1;
                    const sideX = rDir === 1 ? perp1X : perp2X;
                    const sideY = rDir === 1 ? perp1Y : perp2Y;
                    const sideIdx = (y + sideY) * size + (x + sideX);

                    if (this.data[sideIdx] === MAT.AIR) {
                        this.swap(x, y, x + sideX, y + sideY);
                        movedCount++;
                    }
                } else if (mat === MAT.SAND || mat === MAT.DIRT || mat === MAT.GUNPOWDER || mat === MAT.GRAVITITE) {
                    const rDir = Math.random() > 0.5 ? 1 : -1;
                    const diagX = stepX + (rDir === 1 ? perp1X : perp2X);
                    const diagY = stepY + (rDir === 1 ? perp1Y : perp2Y);
                    const diagIdx = (y + diagY) * size + (x + diagX);

                    if (this.data[diagIdx] === MAT.AIR) {
                        this.swap(x, y, x + diagX, y + diagY);
                        movedCount++;
                    }
                }
            }
        }

        if (movedCount > 0) {
            this.isDirty = true;
        } else {
            this.hasActiveParticles = false;
        }
    }

    isLiquid(mat) {
        return mat === MAT.WATER || mat === MAT.LAVA || mat === MAT.ACID || mat === MAT.OIL;
    }

    swap(x1, y1, x2, y2) {
        const idx1 = y1 * this.gridSize + x1;
        const idx2 = y2 * this.gridSize + x2;

        const m1 = this.data[idx1];
        const c1 = this.colors[idx1];
        const l1 = this.life[idx1];

        this.data[idx1] = this.data[idx2];
        this.colors[idx1] = this.colors[idx2];
        this.life[idx1] = this.life[idx2];

        this.data[idx2] = m1;
        this.colors[idx2] = c1;
        this.life[idx2] = l1;
    }

    checkFireNeighbors(x, y) {
        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [ox, oy] of offsets) {
            const nx = x + ox;
            const ny = y + oy;
            const nIdx = ny * this.gridSize + nx;
            const nMat = this.data[nIdx];

            if (nMat === MAT.OIL || nMat === MAT.GUNPOWDER) {
                this.data[nIdx] = MAT.FIRE;
                this.colors[nIdx] = this.palettes.fireHot;
                this.life[nIdx] = 14;
            } else if (nMat === MAT.ICE) {
                this.data[nIdx] = MAT.WATER;
                this.colors[nIdx] = this.palettes.water;
            }
        }
    }

    checkReactions(x, y, mat) {
        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const idx = y * this.gridSize + x;

        for (const [ox, oy] of offsets) {
            const nx = x + ox;
            const ny = y + oy;
            const nIdx = ny * this.gridSize + nx;
            const nMat = this.data[nIdx];

            if (mat === MAT.LAVA && nMat === MAT.WATER) {
                this.data[idx] = MAT.OBSIDIAN;
                this.colors[idx] = this.palettes.obsidian;
                this.data[nIdx] = MAT.STEAM;
                this.colors[nIdx] = this.palettes.steam;
                this.life[nIdx] = 16;
                return true;
            }

            if (mat === MAT.ACID && (nMat === MAT.ROCK || nMat === MAT.SAND || nMat === MAT.DIRT || nMat === MAT.ICE)) {
                this.data[idx] = MAT.AIR;
                this.colors[idx] = this.palettes.air;
                this.data[nIdx] = MAT.STEAM;
                this.colors[nIdx] = this.palettes.acidGlow;
                this.life[nIdx] = 10;
                return true;
            }
        }
        return false;
    }

    renderToCanvas() {
        const totalPixels = this.gridSize * this.gridSize;
        for (let i = 0; i < totalPixels; i++) {
            this.buf32[i] = this.colors[i];
        }
        this.ctx.putImageData(this.imgData, 0, 0);
        this.isDirty = false;
    }

    update(dt, game = null) {
        this.simTickAccumulator += dt;
        const tickRate = 0.033;

        while (this.simTickAccumulator >= tickRate) {
            this.stepSimulation(game);
            this.simTickAccumulator -= tickRate;
        }

        if (this.isDirty) {
            this.renderToCanvas();
            this.recomputeMassDistribution();
        }
    }

    disperseRemainingMaterial(game) {
        if (!game || !game.particles || typeof game.particles.spawnOrbitalGrain !== 'function') return;

        const pVx = this.planet.vx || 0;
        const pVy = this.planet.vy || 0;
        const step = 3; // Sample grid to balance particle density & performance

        for (let y = 1; y < this.gridSize - 1; y += step) {
            for (let x = 1; x < this.gridSize - 1; x += step) {
                const idx = y * this.gridSize + x;
                const mat = this.data[idx];
                if (mat === MAT.AIR) continue;

                const wx = this.planet.x + (x - this.cx) * this.scale;
                const wy = this.planet.y + (y - this.cy) * this.scale;

                const dx = x - this.cx;
                const dy = y - this.cy;
                const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.8;
                const blastSpeed = 40 + Math.random() * 180;

                const vx = pVx + Math.cos(angle) * blastSpeed;
                const vy = pVy + Math.sin(angle) * blastSpeed;

                game.particles.spawnOrbitalGrain(
                    wx, wy,
                    vx, vy,
                    this.colors[idx],
                    mat,
                    null // sourcePlanet null so it orbits freely and can accrete anywhere
                );
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(
            this.canvas,
            -this.gridSize * this.scale * 0.5,
            -this.gridSize * this.scale * 0.5,
            this.gridSize * this.scale,
            this.gridSize * this.scale
        );
        ctx.restore();
    }
}

