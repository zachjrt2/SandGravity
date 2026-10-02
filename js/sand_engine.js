// Radial Falling Sand Engine & Massive Cosmic Planetary Accretion Simulation
// All gravity accelerates towards a single central point (cx, cy), naturally forming a spherical planet.

export const MAT = {
    AIR: 0,
    BEDROCK: 1,
    STONE: 2,
    DIRT: 3,
    SAND: 4,
    WATER: 5,
    LAVA: 6,
    ACID: 7,
    OIL: 8,
    FIRE: 9,
    GUNPOWDER: 10,
    ICE: 11,
    OBSIDIAN: 12,
    GRAVITITE: 13,
    FLORA: 14,
    STEAM: 15,
    GLASS: 16,
    DIAMOND: 17,
    WOOD: 18,
    BRICK: 19,
    METAL: 20,
    NITRO: 21,
    C4: 22,
    THERMITE: 23,
    COAL: 24,
    CONCRETE: 25,
    SNOW: 26,
    SALT: 27,
    SMOKE: 28,
    MUD: 29,
    // Phase 2: Powder Toy Cryogenics, Gases, Heavy Liquids, Cosmic & Energy
    LN2: 30,       // Liquid Nitrogen (Sub-zero cryogen)
    MERC: 31,      // Mercury (Ultra-dense heavy liquid metal)
    GEL: 32,       // Elastic Gel (Viscous cushion fluid)
    SOAP: 33,      // Soap (Oil dissolver / Acid neutralizer)
    METN: 34,      // Methane Gas (Flammable hydrocarbon gas)
    OXYG: 35,      // Oxygen Gas (Combustion oxidizer & amplifier)
    HYGN: 36,      // Hydrogen Gas (Ultra-light explosive gas)
    CO2: 37,       // Carbon Dioxide (Heavy fire suppressor gas)
    PLSM: 38,      // Plasma (Ionized high-energy matter)
    FWRK: 39,      // Fireworks (Pyrotechnic sparkling charges)
    CLNE: 40,      // Clone (Replicator block)
    VOID: 41,      // Void (Abyssal matter sink / eater)
    BHOL: 42,      // Black Hole (Radial gravity vortex)
    WHOL: 43,      // White Hole (Radial antigravity pusher)
    URAN: 44,      // Uranium-235 (Radioactive fissile ore)
    NEUT: 45,      // Neutron Radiation Particle
    PHOT: 46,      // Photon Light Beam
    // Phase 3: Powder Toy Electronics, Wire Logic, Semiconductors & Sensors
    SPRK: 47,      // Electrical Spark (Active current)
    INSL: 48,      // Insulator (Blocks electrical propagation & acid)
    BATT: 49,      // Battery (Continuous electrical power generator)
    SWCH: 50,      // Switch (Toggleable logic gate wire: PSCN=ON, NSCN=OFF)
    PSCN: 51,      // P-Type Semiconductor (Diode anode: turns SWCH ON)
    NSCN: 52,      // N-Type Semiconductor (Diode cathode: turns SWCH OFF)
    DET: 53,       // Sensor / Proximity Detector (Emits spark on motion)
    TESL: 54,      // Tesla Coil (Discharges high-voltage lightning arcs)
    LCRY: 55,      // Liquid Crystal Display (Illuminates when powered)
    EMP: 56,       // EMP Pulse Bomb (Charges all circuits in radius)
    ELEC: 57       // High-Voltage Lightning Arc (Arcs through space)
};

// Material definitions with physics properties & render colors (0xAABBGGRR in Little Endian)
export const MAT_PROPS = {
    [MAT.AIR]: { name: 'Vacuum', solid: false, liquid: false, gas: false, density: 0, dispersion: 0, color: 0x00000000, desc: 'Empty space' },
    [MAT.BEDROCK]: { name: 'Bedrock', solid: true, liquid: false, gas: false, density: 1000, dispersion: 0, color: 0xFF2A2A2A, desc: 'Indestructible planetary crust' },
    [MAT.STONE]: { name: 'Stone', solid: true, liquid: false, gas: false, density: 100, dispersion: 0, color: 0xFF6B7280, desc: 'Heavy solid rock' },
    [MAT.DIRT]: { name: 'Dirt', solid: false, liquid: false, gas: false, density: 40, dispersion: 1, color: 0xFF365A78, desc: 'Fertile planetary soil' },
    [MAT.SAND]: { name: 'Sand', solid: false, liquid: false, gas: false, density: 35, dispersion: 2, color: 0xFF58B4D4, desc: 'Granular powder regolith' },
    [MAT.WATER]: { name: 'Water', solid: false, liquid: true, gas: false, density: 20, dispersion: 6, color: 0xFFD47820, desc: 'Life-giving circular fluid' },
    [MAT.LAVA]: { name: 'Lava', solid: false, liquid: true, gas: false, density: 50, dispersion: 3, color: 0xFF1450FA, desc: 'Molten magma rock' },
    [MAT.ACID]: { name: 'Acid', solid: false, liquid: true, gas: false, density: 25, dispersion: 5, color: 0xFF20FF40, desc: 'Corrosive chemical' },
    [MAT.OIL]: { name: 'Oil', solid: false, liquid: true, gas: false, density: 15, dispersion: 5, color: 0xFF1C2833, desc: 'Flammable crude hydrocarbon' },
    [MAT.FIRE]: { name: 'Fire', solid: false, liquid: false, gas: true, density: -10, dispersion: 2, color: 0xFF0088FF, desc: 'Thermal combustion flame' },
    [MAT.GUNPOWDER]: { name: 'Gunpowder', solid: false, liquid: false, gas: false, density: 38, dispersion: 2, color: 0xFF4A4A52, desc: 'Explosive chemical powder' },
    [MAT.ICE]: { name: 'Ice', solid: true, liquid: false, gas: false, density: 18, dispersion: 0, color: 0xFFFAEA96, desc: 'Solid frozen water' },
    [MAT.OBSIDIAN]: { name: 'Obsidian', solid: true, liquid: false, gas: false, density: 120, dispersion: 0, color: 0xFF351A25, desc: 'Tough volcanic glass' },
    [MAT.GRAVITITE]: { name: 'Gravitite', solid: false, liquid: false, gas: false, density: -30, dispersion: 2, color: 0xFFFA50DA, desc: 'Antigravity powder' },
    [MAT.FLORA]: { name: 'Flora', solid: true, liquid: false, gas: false, density: 30, dispersion: 0, color: 0xFF20A030, desc: 'Growing planetary vegetation' },
    [MAT.STEAM]: { name: 'Steam', solid: false, liquid: false, gas: true, density: -15, dispersion: 3, color: 0x88DDDDDD, desc: 'Hot vapor' },
    [MAT.GLASS]: { name: 'Glass', solid: true, liquid: false, gas: false, density: 80, dispersion: 0, color: 0x99B0D8E8, desc: 'Refractive silicate barrier' },
    [MAT.DIAMOND]: { name: 'Diamond', solid: true, liquid: false, gas: false, density: 500, dispersion: 0, color: 0xFFE0FFFF, desc: 'Ultra-hard crystal' },
    [MAT.WOOD]: { name: 'Wood', solid: true, liquid: false, gas: false, density: 25, dispersion: 0, color: 0xFF2A5078, desc: 'Flammable organic timber' },
    [MAT.BRICK]: { name: 'Brick', solid: true, liquid: false, gas: false, density: 95, dispersion: 0, color: 0xFF3C4A8A, desc: 'Refractory masonry' },
    [MAT.METAL]: { name: 'Metal', solid: true, liquid: false, gas: false, density: 150, dispersion: 0, color: 0xFFB0B0C0, desc: 'Conductive structural alloy' },
    [MAT.NITRO]: { name: 'Nitroglycerin', solid: false, liquid: true, gas: false, density: 22, dispersion: 5, color: 0xFF20D040, desc: 'Shock-sensitive liquid explosive' },
    [MAT.C4]: { name: 'C-4', solid: true, liquid: false, gas: false, density: 45, dispersion: 0, color: 0xFF708090, desc: 'Stable plastic explosive' },
    [MAT.THERMITE]: { name: 'Thermite', solid: false, liquid: false, gas: false, density: 60, dispersion: 1, color: 0xFF3070FF, desc: 'Ultra-hot metal incendiary' },
    [MAT.COAL]: { name: 'Coal', solid: false, liquid: false, gas: false, density: 42, dispersion: 1, color: 0xFF181818, desc: 'Slow-burning carbon fuel' },
    [MAT.CONCRETE]: { name: 'Concrete', solid: false, liquid: false, gas: false, density: 55, dispersion: 2, color: 0xFF8A9A9A, desc: 'Powder that cures in water' },
    [MAT.SNOW]: { name: 'Snow', solid: false, liquid: false, gas: false, density: 12, dispersion: 1, color: 0xFFFFFFFF, desc: 'Light crystalline precipitation' },
    [MAT.SALT]: { name: 'Salt', solid: false, liquid: false, gas: false, density: 32, dispersion: 2, color: 0xFFFAFAFA, desc: 'Melts ice into water' },
    [MAT.SMOKE]: { name: 'Smoke', solid: false, liquid: false, gas: true, density: -8, dispersion: 3, color: 0x66505050, desc: 'Combustion byproduct' },
    [MAT.MUD]: { name: 'Mud', solid: false, liquid: true, gas: false, density: 38, dispersion: 3, color: 0xFF2A3C4E, desc: 'Wet earth sludge' },

    // Phase 2 Elements
    [MAT.LN2]: { name: 'Liquid Nitrogen', solid: false, liquid: true, gas: false, density: 16, dispersion: 6, color: 0xFFFFF080, desc: 'Sub-zero cryogen freezing matter' },
    [MAT.MERC]: { name: 'Mercury', solid: false, liquid: true, gas: false, density: 140, dispersion: 4, color: 0xFF9E9EA8, desc: 'Ultra-dense heavy liquid metal' },
    [MAT.GEL]: { name: 'Gel', solid: false, liquid: true, gas: false, density: 22, dispersion: 2, color: 0xFF00E676, desc: 'Viscous shock-absorbing fluid' },
    [MAT.SOAP]: { name: 'Soap', solid: false, liquid: true, gas: false, density: 18, dispersion: 4, color: 0xFFE080FF, desc: 'Dissolves oils and neutralizes acid' },
    [MAT.METN]: { name: 'Methane Gas', solid: false, liquid: false, gas: true, density: -12, dispersion: 3, color: 0x8840A070, desc: 'Highly flammable rising gas' },
    [MAT.OXYG]: { name: 'Oxygen Gas', solid: false, liquid: false, gas: true, density: -10, dispersion: 3, color: 0x88FFB040, desc: 'Powerful combustion accelerant' },
    [MAT.HYGN]: { name: 'Hydrogen Gas', solid: false, liquid: false, gas: true, density: -25, dispersion: 4, color: 0x88FFE0C0, desc: 'Ultra-light explosive gas' },
    [MAT.CO2]: { name: 'Carbon Dioxide', solid: false, liquid: false, gas: true, density: 6, dispersion: 2, color: 0xAA606060, desc: 'Heavy fire extinguishing gas' },
    [MAT.PLSM]: { name: 'Plasma', solid: false, liquid: false, gas: true, density: -18, dispersion: 2, color: 0xFF00FFFF, desc: 'Ionized fusion matter destroying everything' },
    [MAT.FWRK]: { name: 'Fireworks', solid: false, liquid: false, gas: false, density: 36, dispersion: 2, color: 0xFFFF40B0, desc: 'Pyrotechnic sparkling charges' },
    [MAT.CLNE]: { name: 'Clone', solid: true, liquid: false, gas: false, density: 1000, dispersion: 0, color: 0xFF00E5FF, desc: 'Replicates any material touching it' },
    [MAT.VOID]: { name: 'Void', solid: true, liquid: false, gas: false, density: 1000, dispersion: 0, color: 0xFF140018, desc: 'Devours and erases all matter' },
    [MAT.BHOL]: { name: 'Black Hole', solid: true, liquid: false, gas: false, density: 1000, dispersion: 0, color: 0xFF400030, desc: 'Singularity pulling in matter' },
    [MAT.WHOL]: { name: 'White Hole', solid: true, liquid: false, gas: false, density: 1000, dispersion: 0, color: 0xFFFFFFFF, desc: 'Repulsor pushing matter away' },
    [MAT.URAN]: { name: 'Uranium-235', solid: true, liquid: false, gas: false, density: 110, dispersion: 0, color: 0xFF20D040, desc: 'Radioactive fissile isotope' },
    [MAT.NEUT]: { name: 'Neutron', solid: false, liquid: false, gas: true, density: -50, dispersion: 5, color: 0xFFE0E0FF, desc: 'Cosmic particle triggering fission' },
    [MAT.PHOT]: { name: 'Photon Beam', solid: false, liquid: false, gas: true, density: -60, dispersion: 5, color: 0xFFFFFFFF, desc: 'High-energy light ray' },

    // Phase 3 Electronics & Logic
    [MAT.SPRK]: { name: 'Spark', solid: false, liquid: false, gas: true, density: -100, dispersion: 0, color: 0xFF33FFFF, desc: 'Electrical current conducting through circuits' },
    [MAT.INSL]: { name: 'Insulator', solid: true, liquid: false, gas: false, density: 1000, dispersion: 0, color: 0xFF4B4550, desc: 'Non-conductive, acid-proof electrical barrier' },
    [MAT.BATT]: { name: 'Battery', solid: true, liquid: false, gas: false, density: 200, dispersion: 0, color: 0xFF76E600, desc: 'Continuous electrical power generator' },
    [MAT.SWCH]: { name: 'Switch', solid: true, liquid: false, gas: false, density: 120, dispersion: 0, color: 0xFF2060B0, desc: 'Logic switch (PSCN turns ON, NSCN turns OFF)' },
    [MAT.PSCN]: { name: 'P-Semiconductor', solid: true, liquid: false, gas: false, density: 130, dispersion: 0, color: 0xFFD07030, desc: 'P-type silicon: diode anode, turns switches ON' },
    [MAT.NSCN]: { name: 'N-Semiconductor', solid: true, liquid: false, gas: false, density: 130, dispersion: 0, color: 0xFF3040D0, desc: 'N-type silicon: diode cathode, turns switches OFF' },
    [MAT.DET]: { name: 'Sensor / Detector', solid: true, liquid: false, gas: false, density: 140, dispersion: 0, color: 0xFF907020, desc: 'Proximity radar detector that sparks on motion' },
    [MAT.TESL]: { name: 'Tesla Coil', solid: true, liquid: false, gas: false, density: 180, dispersion: 0, color: 0xFF992277, desc: 'Discharges lightning arcs into the atmosphere' },
    [MAT.LCRY]: { name: 'Liquid Crystal (LCD)', solid: true, liquid: false, gas: false, density: 100, dispersion: 0, color: 0xFF402525, desc: 'Phosphor screen display illuminating when powered' },
    [MAT.EMP]: { name: 'EMP Pulse Bomb', solid: true, liquid: false, gas: false, density: 60, dispersion: 0, color: 0xFFFF20D0, desc: 'Discharges spherical electromagnetic shockwave' },
    [MAT.ELEC]: { name: 'Lightning Arc', solid: false, liquid: false, gas: true, density: -100, dispersion: 8, color: 0xFFFFF0A0, desc: 'High-voltage atmospheric lightning bolt' }
};

export function isGasOrEnergy(mat) {
    if (mat === MAT.AIR) return true;
    const p = MAT_PROPS[mat];
    if (p && p.gas) return true;
    return (
        mat === MAT.FIRE ||
        mat === MAT.STEAM ||
        mat === MAT.SMOKE ||
        mat === MAT.METN ||
        mat === MAT.OXYG ||
        mat === MAT.HYGN ||
        mat === MAT.CO2 ||
        mat === MAT.PLSM ||
        mat === MAT.NEUT ||
        mat === MAT.PHOT ||
        mat === MAT.SPRK ||
        mat === MAT.ELEC
    );
}

export class RadialSandEngine {
    constructor(width = 2048, height = 2048, scale = 4.0) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.cx = Math.floor(width / 2);
        this.cy = Math.floor(height / 2);

        // Core physics grids (4.19M cells)
        this.size = width * height;
        this.data = new Uint8Array(this.size);
        this.life = new Uint8Array(this.size);
        this.variation = new Uint8Array(this.size);
        this.ctype = new Uint8Array(this.size);     // Underlying conductor type under spark
        this.swchState = new Uint8Array(this.size); // Switch ON (1) / OFF (0) state

        // Render buffer - Direct zero-copy Uint32Array pixel buffer
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.imgData = this.ctx.createImageData(width, height);
        this.colors = new Uint32Array(this.imgData.data.buffer);
        this.buf32 = this.colors;

        // 32x32 Spatial Chunk Grid for 90% CPU Sleeping & Culling
        this.chunkSize = 32;
        this.chunksX = Math.ceil(width / this.chunkSize);
        this.chunksY = Math.ceil(height / this.chunkSize);
        this.chunkCount = this.chunksX * this.chunksY;
        this.chunkActive = new Uint8Array(this.chunkCount);
        this.chunkActive.fill(6); // Wake all chunks initially

        // Active Simulation Bounding Box for High-Speed 60 FPS Acceleration
        this.activeBounds = {
            minX: Math.max(1, this.cx - 300),
            maxX: Math.min(width - 2, this.cx + 300),
            minY: Math.max(1, this.cy - 300),
            maxY: Math.min(height - 2, this.cy + 300)
        };

        // Gravity parameters (Balanced for expanded 4x cosmic space)
        this.gravityStrength = 1.0;
        this.gravityInverted = false;
        this.gravityConstant = 180000;

        // Ballistic Orbital Particles
        this.orbitalParticles = [];
        this.maxOrbitalParticles = 4000;

        // Active Emitters in sandbox
        this.emitters = [];

        // Dynamic surface radius cache (360 degrees)
        this.surfaceRadiusCache = new Float32Array(360);

        // Animation timing
        this.simTickAccumulator = 0;
        this.isDirty = true;
        this.needsFullTextureUpload = true;

        // Initialize noise variation
        for (let i = 0; i < this.size; i++) {
            this.variation[i] = Math.floor(Math.random() * 32);
        }

        // Build massive sophisticated cosmic planetary system
        this.generateStarterPlanet(525);
    }

    wakeChunk(x, y) {
        const cx = Math.floor(x / this.chunkSize);
        const cy = Math.floor(y / this.chunkSize);
        if (cx >= 0 && cx < this.chunksX && cy >= 0 && cy < this.chunksY) {
            for (let dy = -1; dy <= 1; dy++) {
                const ncy = cy + dy;
                if (ncy < 0 || ncy >= this.chunksY) continue;
                for (let dx = -1; dx <= 1; dx++) {
                    const ncx = cx + dx;
                    if (ncx >= 0 && ncx < this.chunksX) {
                        this.chunkActive[ncy * this.chunksX + ncx] = 6;
                    }
                }
            }
        }
    }

    expandActiveBounds(x, y, margin = 16) {
        this.wakeChunk(x, y);
        if (x - margin < this.activeBounds.minX) this.activeBounds.minX = Math.max(1, x - margin);
        if (x + margin > this.activeBounds.maxX) this.activeBounds.maxX = Math.min(this.width - 2, x + margin);
        if (y - margin < this.activeBounds.minY) this.activeBounds.minY = Math.max(1, y - margin);
        if (y + margin > this.activeBounds.maxY) this.activeBounds.maxY = Math.min(this.height - 2, y + margin);
    }

    reset() {
        this.data.fill(MAT.AIR);
        this.colors.fill(0);
        this.life.fill(0);
        this.ctype.fill(0);
        this.swchState.fill(0);
        if (this.chunkActive) this.chunkActive.fill(6);
        this.orbitalParticles = [];
        this.emitters = [];
        this.activeBounds = {
            minX: Math.max(1, this.cx - 260),
            maxX: Math.min(this.width - 2, this.cx + 260),
            minY: Math.max(1, this.cy - 260),
            maxY: Math.min(this.height - 2, this.cy + 260)
        };
        this.isDirty = true;
        this.needsFullTextureUpload = true;
        this.updateSurfaceCache();
    }

    worldToGrid(wx, wy) {
        return {
            x: Math.round(this.cx + wx / this.scale),
            y: Math.round(this.cy + wy / this.scale)
        };
    }

    gridToWorld(gx, gy) {
        return {
            x: (gx - this.cx) * this.scale,
            y: (gy - this.cy) * this.scale
        };
    }

    getMat(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return MAT.BEDROCK;
        return this.data[y * this.width + x];
    }

    sparkCell(x, y, origMat = null) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
        const idx = y * this.width + x;
        const curMat = this.data[idx];
        if (curMat === MAT.SPRK || curMat === MAT.AIR || curMat === MAT.BEDROCK || curMat === MAT.INSL) return false;

        this.ctype[idx] = origMat || (curMat !== MAT.SPRK ? curMat : MAT.METAL);
        this.data[idx] = MAT.SPRK;
        this.life[idx] = 4;
        this.colors[idx] = 0xFF33FFFF; // Brilliant glowing electric yellow-cyan
        this.expandActiveBounds(x, y, 10);
        this.isDirty = true;
        return true;
    }

    triggerEMP(cx, cy, radius = 35) {
        const w = this.width;
        const h = this.height;
        this.setMat(cx, cy, MAT.AIR);

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const dist = Math.hypot(dx, dy);
                if (dist > radius) continue;
                const tx = cx + dx;
                const ty = cy + dy;
                if (tx >= 0 && tx < w && ty >= 0 && ty < h) {
                    const idx = ty * w + tx;
                    const mat = this.data[idx];
                    if (mat === MAT.METAL || mat === MAT.MERC || mat === MAT.PSCN || mat === MAT.NSCN || mat === MAT.SWCH || mat === MAT.TESL || mat === MAT.LCRY) {
                        this.sparkCell(tx, ty);
                    } else if (dist >= radius - 2 && Math.random() < 0.35 && mat === MAT.AIR) {
                        this.setMat(tx, ty, MAT.ELEC);
                    }
                }
            }
        }
        this.carveExplosion(this.gridToWorld(cx, cy).x, this.gridToWorld(cx, cy).y, radius * this.scale * 0.5, { pushPower: 1.8 });
    }

    setMat(x, y, mat, color = null) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        const idx = y * this.width + x;
        this.data[idx] = mat;

        if (mat !== MAT.AIR) {
            this.expandActiveBounds(x, y, 12);
        }

        if (color !== null) {
            this.colors[idx] = color;
        } else {
            this.colors[idx] = this.getVariedColor(mat, idx);
        }

        if (mat === MAT.FIRE) this.life[idx] = 10 + Math.floor(Math.random() * 12);
        if (mat === MAT.STEAM) this.life[idx] = 20 + Math.floor(Math.random() * 16);
        if (mat === MAT.SMOKE) this.life[idx] = 25 + Math.floor(Math.random() * 20);
        if (mat === MAT.FLORA) this.life[idx] = 40 + Math.floor(Math.random() * 30);
        if (mat === MAT.COAL) this.life[idx] = 120 + Math.floor(Math.random() * 80);
        if (mat === MAT.THERMITE) this.life[idx] = 15;
        if (mat === MAT.PLSM) this.life[idx] = 14 + Math.floor(Math.random() * 8);
        if (mat === MAT.METN) this.life[idx] = 60 + Math.floor(Math.random() * 40);
        if (mat === MAT.OXYG) this.life[idx] = 60 + Math.floor(Math.random() * 40);
        if (mat === MAT.HYGN) this.life[idx] = 45 + Math.floor(Math.random() * 30);
        if (mat === MAT.CO2) this.life[idx] = 80 + Math.floor(Math.random() * 50);
        if (mat === MAT.NEUT) this.life[idx] = 20 + Math.floor(Math.random() * 15);
        if (mat === MAT.PHOT) this.life[idx] = 30 + Math.floor(Math.random() * 15);
        if (mat === MAT.FWRK) this.life[idx] = 25;
        if (mat === MAT.LN2) this.life[idx] = 120;

        // Phase 3 Electronics initializations
        if (mat === MAT.SPRK) {
            this.life[idx] = 4;
            if (!this.ctype[idx]) this.ctype[idx] = MAT.METAL;
        } else if (mat === MAT.SWCH) {
            this.swchState[idx] = 0; // Default switch OFF
        } else if (mat === MAT.ELEC) {
            this.life[idx] = 8 + Math.floor(Math.random() * 6);
        } else if (mat === MAT.EMP) {
            this.life[idx] = 10;
        } else {
            this.ctype[idx] = mat;
            this.life[idx] = 0;
        }

        this.isDirty = true;
    }

    getVariedColor(mat, idx) {
        const base = MAT_PROPS[mat].color;
        if (mat === MAT.AIR) return 0;

        const v = (this.variation[idx] || 0) - 16;
        let r = base & 0xFF;
        let g = (base >> 8) & 0xFF;
        let b = (base >> 16) & 0xFF;
        let a = (base >> 24) & 0xFF;

        r = Math.max(0, Math.min(255, r + v));
        g = Math.max(0, Math.min(255, g + v));
        b = Math.max(0, Math.min(255, b + v));

        return (a << 24) | (b << 16) | (g << 8) | r;
    }

    getMatAtWorld(wx, wy) {
        const { x, y } = this.worldToGrid(wx, wy);
        return this.getMat(x, y);
    }

    isSolidAtWorld(wx, wy) {
        const mat = this.getMatAtWorld(wx, wy);
        return !isGasOrEnergy(mat);
    }

    /**
     * Massive Multi-Body Procedural Cosmic Planetary Generator:
     * Generates a colossal terrestrial planet (radius ~580px) with rich multi-layer geology,
     * deep mercury sub-mantles, subterranean oil & acid caverns, buried cyber-logic vaults,
     * active volcanoes, vast oceans, polar ice caps, Tesla spires, 4 diverse moons,
     * and 2 massive outer asteroid & comet belts incorporating all Powder Toy materials!
     */
    /**
     * Authentic Earth-Like Terrestrial Planetary Generator:
     * Generates a planet with realistic planetary geology:
     * 1. Heavy Solid Inner Core (Bedrock & High-Pressure Diamond crystal)
     * 2. Molten Magma Outer Core (Hot flowing Lava & deep Obsidian crust plates)
     * 3. Rocky Mantle & Lithosphere (Stone with rich branching mineral veins: Coal, Metal Ore, Quartz, Oil, Uranium)
     * 4. Sturdy Crust (Basalt, Clay/Mud, and fertile Dirt topsoil)
     * 5. Vast Oceanic Basins (~65% surface water coverage with sandy beaches & continental shelves)
     * 6. Lush Biosphere & Continents (Sprawling green Flora biomes & Wood forest canopies)
     * 7. Polar Glaciers & Ice Caps (Solid Ice sheets & Snow at poles)
     * 8. Geothermal Volcanoes & Hydrothermal vents
     * 9. Atmospheric Halo (Oxygen & Steam clouds)
     * 10. Natural Rocky Lunar Companion Moon in stable orbit
     */
    generateStarterPlanet(radius = 525) {
        this.reset();
        const rCells = radius / this.scale;

        // Core Stratigraphic Boundaries (Earth Proportions)
        const innerCoreR = rCells * 0.12;
        const outerCoreMagmaR = rCells * 0.36;
        const lowerMantleR = rCells * 0.60;
        const upperMantleR = rCells * 0.80;
        const crustR = rCells * 0.92;
        const baseSurfaceR = rCells;

        // Harmonic noise phase shifts
        const p1 = Math.random() * 20;
        const p2 = Math.random() * 20;
        const p3 = Math.random() * 20;
        const p4 = Math.random() * 20;

        // Bounding box for active simulation
        this.activeBounds = {
            minX: Math.max(1, this.cx - Math.round(rCells * 2.6)),
            maxX: Math.min(this.width - 2, this.cx + Math.round(rCells * 2.6)),
            minY: Math.max(1, this.cy - Math.round(rCells * 2.6)),
            maxY: Math.min(this.height - 2, this.cy + Math.round(rCells * 2.6))
        };

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const dx = x - this.cx;
                const dy = y - this.cy;
                const dist = Math.hypot(dx, dy);

                if (dist > rCells * 1.35) continue;

                const angle = Math.atan2(dy, dx);

                // Multi-Octave Harmonic Continental Landmass vs Ocean Basin Elevation
                const continentNoise = Math.sin(angle * 2.5 + p1) * (rCells * 0.10) + Math.cos(angle * 5 + p2) * (rCells * 0.05);
                const mountainNoise = Math.sin(angle * 11 + p3) * (rCells * 0.035) + Math.cos(angle * 22 + p4) * (rCells * 0.015);
                const surfaceElevation = baseSurfaceR + continentNoise + mountainNoise;

                // Subterranean Cavern & Aquifer Noise
                const caveNoise = Math.sin(x * 0.08) * Math.cos(y * 0.08) + Math.sin((x + y) * 0.05);
                const isCave = (dist > outerCoreMagmaR * 1.15 && dist < surfaceElevation * 0.90 && caveNoise > 0.82);

                // 1. SOLID INNER CORE (Heavy Bedrock & Extreme-Pressure Diamond Seed)
                if (dist <= innerCoreR) {
                    if (dist <= innerCoreR * 0.5) {
                        this.setMat(x, y, MAT.BEDROCK);
                    } else if (dist <= innerCoreR * 0.8) {
                        this.setMat(x, y, (Math.random() < 0.35) ? MAT.DIAMOND : MAT.BEDROCK);
                    } else {
                        this.setMat(x, y, MAT.METAL); // Heavy metallic core (Iron/Nickel)
                    }
                } 
                // 2. MOLTEN MAGMA OUTER CORE (Liquid Lava & Obsidian Boundary Plates)
                else if (dist <= outerCoreMagmaR) {
                    if (dist > outerCoreMagmaR - 3) {
                        this.setMat(x, y, MAT.OBSIDIAN); // Thermal transition plate
                    } else if (Math.sin(angle * 6 + dist * 0.15) > 0.88) {
                        this.setMat(x, y, MAT.OBSIDIAN); // Semi-solid mantle plume
                    } else {
                        this.setMat(x, y, MAT.LAVA); // Molten magma
                    }
                } 
                // 3. LOWER MANTLE (Dense Stone, Basalt, Magma conduits & Mineral Veins)
                else if (dist <= lowerMantleR) {
                    if (isCave) {
                        this.setMat(x, y, Math.random() < 0.4 ? MAT.LAVA : MAT.AIR);
                    } else if (Math.sin(angle * 8 + dist * 0.18 + p1) > 0.90) {
                        this.setMat(x, y, MAT.LAVA); // Magma conduit rising upward
                    } else if (Math.sin(x * 0.12 - y * 0.08) > 0.91) {
                        this.setMat(x, y, MAT.METAL); // Deep metallic iron/copper vein
                    } else if (Math.sin(x * 0.09 + y * 0.14) > 0.93) {
                        this.setMat(x, y, MAT.URAN); // Rare radioactive mineral seam
                    } else if (Math.sin(x * 0.15 + y * 0.05) > 0.92) {
                        this.setMat(x, y, MAT.DIAMOND); // Deep diamond geode
                    } else {
                        this.setMat(x, y, (Math.random() < 0.35) ? MAT.BRICK : MAT.STONE);
                    }
                } 
                // 4. UPPER MANTLE & LITHOSPHERE (Stone, Coal seams, Oil reservoirs, Quartz)
                else if (dist <= upperMantleR) {
                    if (isCave) {
                        const cRoll = Math.random();
                        if (cRoll < 0.25) this.setMat(x, y, MAT.WATER); // Subterranean aquifer
                        else if (cRoll < 0.45) this.setMat(x, y, MAT.OIL); // Petroleum cavern
                        else this.setMat(x, y, MAT.AIR);
                    } else if (Math.sin(angle * 12 + dist * 0.12 + p2) > 0.88) {
                        this.setMat(x, y, MAT.COAL); // Coal fossil stratum
                    } else if (Math.sin(x * 0.14 + y * 0.11) > 0.90) {
                        this.setMat(x, y, MAT.METAL); // Native metal ore seam
                    } else if (Math.sin(x * 0.10 - y * 0.15) > 0.91) {
                        this.setMat(x, y, MAT.OIL); // Petroleum pocket
                    } else if (Math.sin(x * 0.18 + y * 0.18) > 0.93) {
                        this.setMat(x, y, MAT.GLASS); // Quartz crystal silicate vein
                    } else {
                        this.setMat(x, y, MAT.STONE);
                    }
                } 
                // 5. LOWER CRUST (Stone, Clay/Mud, Sandstone, Underground Aquifers)
                else if (dist <= crustR) {
                    if (isCave) {
                        this.setMat(x, y, Math.random() < 0.4 ? MAT.WATER : MAT.AIR);
                    } else if (Math.sin(angle * 16 + dist * 0.14) > 0.91) {
                        this.setMat(x, y, MAT.COAL); // Shallow coal layer
                    } else if (Math.sin(x * 0.13 + y * 0.09) > 0.92) {
                        this.setMat(x, y, MAT.SAND); // Subterranean sandstone
                    } else {
                        this.setMat(x, y, (Math.random() < 0.3) ? MAT.MUD : (Math.random() < 0.5 ? MAT.STONE : MAT.DIRT));
                    }
                } 
                // 6. UPPER CRUST & TOPSOIL (Fertile Dirt, Coastal Sand, Mineral Topsoil)
                else if (dist <= surfaceElevation) {
                    const depth = surfaceElevation - dist;
                    if (depth < 3) {
                        // Top layer: fertile dirt or coastal beach sand
                        if (Math.sin(angle * 7 + p1) > 0.55) {
                            this.setMat(x, y, MAT.SAND); // Beach shoreline
                        } else {
                            this.setMat(x, y, MAT.DIRT); // Rich dark humus soil
                        }
                    } else if (depth < 8) {
                        this.setMat(x, y, (Math.random() < 0.6) ? MAT.DIRT : MAT.MUD);
                    } else {
                        this.setMat(x, y, (Math.random() < 0.4) ? MAT.STONE : MAT.DIRT);
                    }
                }
            }
        }

        // 7. VAST LIQUID OCEANS & SEAS (~65% Planet Surface Coverage)
        const seaLevelR = baseSurfaceR + (rCells * 0.015);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const dx = x - this.cx;
                const dy = y - this.cy;
                const dist = Math.hypot(dx, dy);

                if (dist <= seaLevelR && this.getMat(x, y) === MAT.AIR) {
                    this.setMat(x, y, MAT.WATER); // Ocean water
                }
            }
        }

        // 8. POLAR ICE CAPS & GLACIERS (North & South Poles)
        // North Pole: 75° to 105°
        for (let deg = 75; deg <= 105; deg += 2) {
            const rad = (deg / 180) * Math.PI;
            const r = this.getSurfaceRadiusAtAngle(rad) / this.scale;
            const px = Math.round(this.cx + Math.cos(rad) * (r - 2));
            const py = Math.round(this.cy + Math.sin(rad) * (r - 2));
            this.fillCircle(px, py, 14, MAT.ICE);
            this.fillCircle(px, py, 5, MAT.SNOW);
        }
        // South Pole: 255° to 285°
        for (let deg = 255; deg <= 285; deg += 2) {
            const rad = (deg / 180) * Math.PI;
            const r = this.getSurfaceRadiusAtAngle(rad) / this.scale;
            const px = Math.round(this.cx + Math.cos(rad) * (r - 2));
            const py = Math.round(this.cy + Math.sin(rad) * (r - 2));
            this.fillCircle(px, py, 14, MAT.ICE);
            this.fillCircle(px, py, 5, MAT.SNOW);
        }

        // 9. LUSH BIOSPHERE: FLORA CONTINENTS & WOOD CANOPY FORESTS
        for (let deg = 0; deg < 360; deg += 1) {
            // Avoid polar ice regions (North: 70°-110°, South: 250°-290°)
            if ((deg >= 70 && deg <= 110) || (deg >= 250 && deg <= 290)) continue;

            const rad = (deg / 180) * Math.PI;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            // Raycast down from outside atmosphere to find true solid surface
            for (let r = Math.round(baseSurfaceR * 1.25); r >= Math.round(seaLevelR); r--) {
                const gx = Math.round(this.cx + cos * r);
                const gy = Math.round(this.cy + sin * r);
                if (gx < 0 || gx >= this.width || gy < 0 || gy >= this.height) continue;

                const mat = this.data[gy * this.width + gx];
                if (mat === MAT.DIRT || mat === MAT.MUD || mat === MAT.SAND || mat === MAT.STONE) {
                    if (r > seaLevelR) {
                        // Place green flora top layer
                        const topX = Math.round(this.cx + cos * (r + 1));
                        const topY = Math.round(this.cy + sin * (r + 1));
                        if (topX >= 0 && topX < this.width && topY >= 0 && topY < this.height && this.data[topY * this.width + topX] === MAT.AIR) {
                            this.setMat(topX, topY, MAT.FLORA);

                            // 40% chance of tree trunk and canopy
                            if (Math.random() < 0.40) {
                                this.setMat(gx, gy, MAT.WOOD);
                                const treeH = 2 + Math.floor(Math.random() * 4);
                                for (let th = 1; th <= treeH; th++) {
                                    const tx = Math.round(this.cx + cos * (r + th));
                                    const ty = Math.round(this.cy + sin * (r + th));
                                    if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height && this.data[ty * this.width + tx] === MAT.AIR) {
                                        this.setMat(tx, ty, th < treeH ? MAT.WOOD : MAT.FLORA);
                                    }
                                }
                            }
                        }
                    }
                    break;
                } else if (mat === MAT.WATER || mat === MAT.ICE) {
                    break; // Oceanic basin or polar ice
                }
            }
        }

        // 10. ACTIVE GEOTHERMAL VOLCANOES (Connecting Mantle Magma to Surface Calderas)
        const volcanoAngles = [Math.PI * 0.32, Math.PI * 1.62];
        for (const vAngle of volcanoAngles) {
            const vR = this.getSurfaceRadiusAtAngle(vAngle) / this.scale;
            const vx = Math.round(this.cx + Math.cos(vAngle) * (vR - 2));
            const vy = Math.round(this.cy + Math.sin(vAngle) * (vR - 2));
            
            // Volcano Caldera
            this.fillCircle(vx, vy, 8, MAT.OBSIDIAN);
            this.fillCircle(vx, vy, 5, MAT.LAVA);

            // Magma conduit down to outer core
            for (let r = vR - 3; r >= outerCoreMagmaR; r -= 2) {
                const tx = Math.round(this.cx + Math.cos(vAngle) * r);
                const ty = Math.round(this.cy + Math.sin(vAngle) * r);
                this.fillCircle(tx, ty, 3, MAT.LAVA);
            }
        }

        // 11. ATMOSPHERIC HALO & CLOUDS (Oxygen, Steam clouds, Light drifting vapors)
        for (let i = 0; i < 350; i++) {
            const a = Math.random() * Math.PI * 2;
            const d = (baseSurfaceR + 6) + Math.random() * (rCells * 0.18);
            const ax = Math.round(this.cx + Math.cos(a) * d);
            const ay = Math.round(this.cy + Math.sin(a) * d);
            if (ax >= 0 && ax < this.width && ay >= 0 && ay < this.height && this.getMat(ax, ay) === MAT.AIR) {
                const gasType = (Math.random() < 0.65) ? MAT.STEAM : MAT.OXYG;
                this.setMat(ax, ay, gasType);
            }
        }

        // 12. NATURAL ROCKY COMPANION MOON (Stone, Basalt, Regolith Sand)
        const moonAngle = 0.68;
        const moonDist = rCells * 1.85;
        const mx = Math.round(this.cx + Math.cos(moonAngle) * moonDist);
        const my = Math.round(this.cy + Math.sin(moonAngle) * moonDist);
        this.fillCircle(mx, my, 28, MAT.STONE);
        this.fillCircle(mx, my, 12, MAT.OBSIDIAN);
        // Moon surface craters & regolith dust
        for (let a = 0; a < Math.PI * 2; a += 0.2) {
            const sx = Math.round(mx + Math.cos(a) * 27);
            const sy = Math.round(my + Math.sin(a) * 27);
            if (sx >= 0 && sx < this.width && sy >= 0 && sy < this.height) {
                this.setMat(sx, sy, Math.random() < 0.5 ? MAT.SAND : MAT.STONE);
            }
        }

        this.updateSurfaceCache();
    }

    /**
     * Fully Random Planetary Accretion Generator:
     * Spawns an exotic sphere composed of completely randomized Voronoi pockets,
     * turbulent chaotic veins, and volatile clusters from all 57 Powder Toy materials.
     * The dynamic density stratification and chemical reaction engine immediately take over!
     */
    generateChaosPlanet(radius = 580) {
        this.reset();
        const rCells = radius / this.scale;
        const allMaterials = Object.values(MAT).filter(m => typeof m === 'number' && m !== MAT.AIR && m !== MAT.BEDROCK);

        // Random core radius
        const coreR = Math.max(8, rCells * (0.12 + Math.random() * 0.12));

        // Generate 35 random Voronoi seed points with random materials
        const numSeeds = 35;
        const seeds = [];
        for (let i = 0; i < numSeeds; i++) {
            const sAngle = Math.random() * Math.PI * 2;
            const sDist = Math.random() * rCells;
            seeds.push({
                x: this.cx + Math.cos(sAngle) * sDist,
                y: this.cy + Math.sin(sAngle) * sDist,
                mat: allMaterials[Math.floor(Math.random() * allMaterials.length)],
                secondaryMat: allMaterials[Math.floor(Math.random() * allMaterials.length)],
                weight: 0.8 + Math.random() * 0.8
            });
        }

        // Noise frequencies & offsets
        const freq1 = 0.05 + Math.random() * 0.06;
        const freq2 = 0.09 + Math.random() * 0.08;
        const p1 = Math.random() * 20;
        const p2 = Math.random() * 20;

        // Bounding box
        this.activeBounds = {
            minX: Math.max(1, this.cx - Math.round(rCells * 3.8)),
            maxX: Math.min(this.width - 2, this.cx + Math.round(rCells * 3.8)),
            minY: Math.max(1, this.cy - Math.round(rCells * 3.8)),
            maxY: Math.min(this.height - 2, this.cy + Math.round(rCells * 3.8))
        };

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const dx = x - this.cx;
                const dy = y - this.cy;
                const dist = Math.hypot(dx, dy);

                // Planet surface shape with harmonic noise variation
                const angle = Math.atan2(dy, dx);
                const surfaceNoise = Math.sin(angle * 5 + p1) * (rCells * 0.08) + Math.cos(angle * 11 + p2) * (rCells * 0.05);
                const maxRadius = rCells + surfaceNoise;

                if (dist > maxRadius) continue;

                if (dist <= coreR) {
                    if (dist <= coreR * 0.4) {
                        this.setMat(x, y, MAT.BEDROCK);
                    } else {
                        const coreMat = [MAT.BHOL, MAT.URAN, MAT.DIAMOND, MAT.OBSIDIAN, MAT.MERC, MAT.GRAVITITE][Math.floor(Math.random() * 6)];
                        this.setMat(x, y, coreMat);
                    }
                    continue;
                }

                // Voronoi nearest seed calculation
                let closestDist = Infinity;
                let secondDist = Infinity;
                let closestSeed = seeds[0];

                for (let i = 0; i < numSeeds; i++) {
                    const s = seeds[i];
                    const sdx = x - s.x;
                    const sdy = y - s.y;
                    const d = (sdx * sdx + sdy * sdy) * s.weight;
                    if (d < closestDist) {
                        secondDist = closestDist;
                        closestDist = d;
                        closestSeed = s;
                    } else if (d < secondDist) {
                        secondDist = d;
                    }
                }

                // Chaotic marble turbulence
                const marble = Math.sin(x * freq1 + y * freq1 + Math.sin(x * freq2 - y * freq2));

                if (Math.abs(closestDist - secondDist) < 18) {
                    this.setMat(x, y, closestSeed.secondaryMat);
                } else if (marble > 0.65) {
                    this.setMat(x, y, closestSeed.secondaryMat);
                } else if (Math.random() < 0.035) {
                    this.setMat(x, y, allMaterials[Math.floor(Math.random() * allMaterials.length)]);
                } else {
                    this.setMat(x, y, closestSeed.mat);
                }
            }
        }

        // Add 3-5 chaotic exotic mini-moons
        const moonCount = 3 + Math.floor(Math.random() * 3);
        for (let m = 0; m < moonCount; m++) {
            const mAngle = (m / moonCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
            const mDist = rCells * (1.6 + Math.random() * 1.8);
            const mx = Math.round(this.cx + Math.cos(mAngle) * mDist);
            const my = Math.round(this.cy + Math.sin(mAngle) * mDist);
            const mRadius = 10 + Math.floor(Math.random() * 18);
            const mMat = allMaterials[Math.floor(Math.random() * allMaterials.length)];
            const mCoreMat = allMaterials[Math.floor(Math.random() * allMaterials.length)];
            this.fillCircle(mx, my, mRadius, mMat);
            this.fillCircle(mx, my, Math.round(mRadius * 0.5), mCoreMat);
        }

        // Add chaotic orbiting asteroid rings
        for (let i = 0; i < 150; i++) {
            const a = Math.random() * Math.PI * 2;
            const d = rCells * (1.35 + Math.random() * 2.3);
            const rx = Math.round(this.cx + Math.cos(a) * d);
            const ry = Math.round(this.cy + Math.sin(a) * d);
            const mat = allMaterials[Math.floor(Math.random() * allMaterials.length)];
            this.fillCircle(rx, ry, Math.floor(Math.random() * 5) + 1, mat);
        }

        this.isDirty = true;
    }

    fillCircle(gx, gy, radius, mat) {
        const rSq = radius * radius;
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (dx * dx + dy * dy <= rSq) {
                    const px = gx + dx;
                    const py = gy + dy;
                    if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
                        this.setMat(px, py, mat);
                    }
                }
            }
        }
    }

    paintWorld(wx, wy, radiusWorld, mat) {
        const { x: gx, y: gy } = this.worldToGrid(wx, wy);
        const rCells = Math.max(1, Math.round(radiusWorld / this.scale));
        this.fillCircle(gx, gy, rCells, mat);
    }

    /**
     * Precision Grain-by-Grain Mining: Removes particles clicked by the player and awards Stardust!
     * Integrates Planetary Crust Hardness vs Laser Drill Power.
     */
    mineAtWorld(wx, wy, radiusWorld = 4) {
        const inc = this.game ? this.game.incrementalEngine : null;
        let planetHardness = 1.0;
        let clickLvl = 0;
        if (inc) {
            const tierData = inc.getTierData ? inc.getTierData() : null;
            planetHardness = (tierData && tierData.hardnessRating) ? tierData.hardnessRating : 1.0;
            clickLvl = (inc.upgrades && inc.upgrades.clickPower) ? inc.upgrades.clickPower.level : 0;
        }

        // Drill power scales gradually with upgrade level
        const drillPower = 1.0 + (clickLvl * 0.5);
        const drillEfficiency = drillPower / planetHardness;

        // Controlled micro-mining radius
        const effectiveRadiusWorld = Math.min(radiusWorld, radiusWorld * Math.pow(Math.max(0.08, drillEfficiency), 0.4));
        const { x: gx, y: gy } = this.worldToGrid(wx, wy);
        const rCells = Math.max(1, Math.round(effectiveRadiusWorld / this.scale));
        const rSq = rCells * rCells;
        let minedCount = 0;
        let totalValue = 0;

        for (let dy = -rCells; dy <= rCells; dy++) {
            for (let dx = -rCells; dx <= rCells; dx++) {
                if (dx * dx + dy * dy <= rSq) {
                    const px = gx + dx;
                    const py = gy + dy;
                    if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
                        const idx = py * this.width + px;
                        const mat = this.data[idx];
                        if (mat !== MAT.AIR) {
                            // Dense minerals resist manual laser drilling
                            let mineralToughness = 1.0;
                            if (mat === MAT.BEDROCK || mat === MAT.VOID || mat === MAT.BHOL) mineralToughness = 3.0;
                            else if (mat === MAT.URAN || mat === MAT.METAL || mat === MAT.DIAMOND || mat === MAT.OBSIDIAN) mineralToughness = 2.0;

                            if (drillEfficiency < 0.65 * mineralToughness && Math.random() > (drillEfficiency / (0.65 * mineralToughness))) {
                                continue; // Mineral resists this drill pulse!
                            }

                            this.data[idx] = MAT.AIR;
                            this.colors[idx] = 0;
                            this.life[idx] = 0;
                            this.isDirty = true;
                            minedCount++;
                            // Exotic materials grant higher value per grain
                            let grainVal = 1;
                            if (mat === MAT.DIAMOND || mat === MAT.URAN || mat === MAT.VOID || mat === MAT.BHOL || mat === MAT.WHOL) grainVal = 3;
                            else if (mat === MAT.LAVA || mat === MAT.OIL || mat === MAT.METAL || mat === MAT.NITRO || mat === MAT.THERMITE) grainVal = 2;
                            totalValue += grainVal;
                        }
                    }
                }
            }
        }

        if (minedCount > 0) {
            this.expandActiveBounds(gx, gy, 8);
            if (inc) {
                const valueMultiplier = 1 + clickLvl * 0.15;
                const earned = Math.max(1, Math.round(totalValue * valueMultiplier));
                inc.addStardust(earned, wx, wy);
            }
            return minedCount;
        } else if (inc && drillEfficiency < 0.65) {
            inc.spawnFloatingText(`⚠️ Hard Crust!`, wx, wy, '#f59e0b');
        }
        return 0;
    }

    /**
     * Radial Explosion: Blasts a crater, vaporizes center, fractures surroundings,
     * and flings hundreds of material voxels into real orbital trajectories!
     */
    carveExplosion(impactWx, impactWy, blastRadius, options = {}) {
        const inc = this.game ? this.game.incrementalEngine : null;
        const hardnessFactor = (inc && inc.getTierData) ? (inc.getTierData().hardnessRating || 1.0) : 1.0;
        // Dense planetary crusts absorb impact energy
        const adjustedRadius = blastRadius / Math.pow(hardnessFactor, 0.10);

        const { x: hitX, y: hitY } = this.worldToGrid(impactWx, impactWy);
        const radiusCells = Math.max(2, Math.round(adjustedRadius / this.scale));
        const vaporizeR = radiusCells * (options.vaporizeRatio !== undefined ? options.vaporizeRatio : 0.6);
        const vaporizeRSq = vaporizeR * vaporizeR;
        const fractureR = radiusCells * 1.35;
        const fractureRSq = fractureR * fractureR;
        const isMagma = options.isMagma || false;
        const pushPower = options.pushPower !== undefined ? options.pushPower : 1.0;

        const minX = Math.max(0, Math.floor(hitX - fractureR));
        const maxX = Math.min(this.width - 1, Math.ceil(hitX + fractureR));
        const minY = Math.max(0, Math.floor(hitY - fractureR));
        const maxY = Math.min(this.height - 1, Math.ceil(hitY + fractureR));

        let destroyedCount = 0;
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const idx = y * this.width + x;
                const mat = this.data[idx];
                if (mat === MAT.AIR || mat === MAT.BEDROCK) continue;

                const dx = x - hitX;
                const dy = y - hitY;
                const distSq = dx * dx + dy * dy;

                if (distSq <= vaporizeRSq) {
                    destroyedCount++;
                    if (mat === MAT.GUNPOWDER || mat === MAT.OIL) {
                        this.setMat(x, y, MAT.FIRE);
                    } else if (isMagma && Math.random() < 0.35) {
                        this.setMat(x, y, MAT.LAVA);
                    } else {
                        this.setMat(x, y, MAT.AIR);
                    }
                } else if (distSq <= fractureRSq) {
                    const dist = Math.sqrt(distSq);
                    const blastRatio = (1 - dist / fractureR);

                    if (Math.random() < 0.25 * blastRatio * pushPower) {
                        destroyedCount++;
                        const { x: wx, y: wy } = this.gridToWorld(x, y);
                        const ejectAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
                        const ejectSpeed = (90 + Math.random() * 200) * pushPower;

                        this.spawnOrbitalParticle(
                            wx, wy,
                            Math.cos(ejectAngle) * ejectSpeed,
                            Math.sin(ejectAngle) * ejectSpeed,
                            mat,
                            this.colors[idx]
                        );

                        this.setMat(x, y, MAT.AIR);
                    } else if (mat === MAT.STONE) {
                        this.setMat(x, y, isMagma ? MAT.LAVA : MAT.SAND);
                    } else if (mat === MAT.ICE) {
                        this.setMat(x, y, isMagma ? MAT.STEAM : MAT.WATER);
                    }
                }
            }
        }

        if (destroyedCount > 0 && this.game && this.game.incrementalEngine) {
            this.game.incrementalEngine.addStardust(destroyedCount, impactWx, impactWy);
        }

        this.isDirty = true;
        this.updateSurfaceCache();
    }

    spawnOrbitalParticle(wx, wy, vx, vy, mat, color = null, blastRadius = null) {
        if (this.orbitalParticles.length >= this.maxOrbitalParticles) {
            this.orbitalParticles.shift();
        }
        this.orbitalParticles.push({
            x: wx,
            y: wy,
            vx: vx,
            vy: vy,
            mat: mat,
            color: color || MAT_PROPS[mat]?.color || 0xFFFFFFFF,
            life: 9.0,
            radius: blastRadius ? Math.max(3.0, blastRadius * 0.15) : 1.8,
            blastRadius: blastRadius || null
        });
    }

    updateOrbitalParticles(dt) {
        const G = this.gravityConstant;
        const soft = 1400;

        for (let i = this.orbitalParticles.length - 1; i >= 0; i--) {
            const p = this.orbitalParticles[i];
            p.life -= dt;

            const dx = -p.x;
            const dy = -p.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            const force = (G * this.gravityStrength) / (distSq + soft);
            const gravDir = this.gravityInverted ? -1 : 1;

            p.vx += (dx / (dist || 1)) * force * gravDir * dt;
            p.vy += (dy / (dist || 1)) * force * gravDir * dt;

            p.x += p.vx * dt;
            p.y += p.vy * dt;

            const { x: gx, y: gy } = this.worldToGrid(p.x, p.y);

            // Immediately destroy orbital particles escaping into the deep vacuum beyond borders
            if (gx <= 2 || gx >= this.width - 3 || gy <= 2 || gy >= this.height - 3 || dist > 3100 || p.life <= 0) {
                this.orbitalParticles.splice(i, 1);
                continue;
            }

            const cellMat = this.getMat(gx, gy);
            if (cellMat !== MAT.AIR && cellMat !== MAT.FIRE && cellMat !== MAT.STEAM) {
                // If it's an explosive asteroid / projectile
                if (p.blastRadius) {
                    this.carveExplosion(p.x, p.y, p.blastRadius, { pushPower: 2.0 });
                    if (this.game) this.game.triggerScreenShake(4, 0.2);
                    this.orbitalParticles.splice(i, 1);
                    continue;
                }

                const prevGx = Math.round(this.cx + (p.x - p.vx * dt * 1.5) / this.scale);
                const prevGy = Math.round(this.cy + (p.y - p.vy * dt * 1.5) / this.scale);

                if (prevGx > 2 && prevGx < this.width - 3 && prevGy > 2 && prevGy < this.height - 3 && this.getMat(prevGx, prevGy) === MAT.AIR) {
                    this.setMat(prevGx, prevGy, p.mat, p.color);
                } else if (gx > 2 && gx < this.width - 3 && gy > 2 && gy < this.height - 3) {
                    this.setMat(gx, gy, p.mat, p.color);
                }
                this.orbitalParticles.splice(i, 1);
                continue;
            }
        }
    }

    stepSimulation() {
        const w = this.width;
        const h = this.height;
        const cx = this.cx;
        const cy = this.cy;
        const data = this.data;
        let moved = false;

        for (const em of this.emitters) {
            if (em.active) {
                const { x: gx, y: gy } = this.worldToGrid(em.x, em.y);
                this.fillCircle(gx, gy, em.radius || 2, em.mat);
            }
        }

        const bMinY = Math.max(1, this.activeBounds.minY - 4);
        const bMaxY = Math.min(h - 2, this.activeBounds.maxY + 4);
        const bMinX = Math.max(1, this.activeBounds.minX - 4);
        const bMaxX = Math.min(w - 2, this.activeBounds.maxX + 4);

        const minCY = Math.max(0, Math.floor(bMinY / 32));
        const maxCY = Math.min(this.chunksY - 1, Math.floor(bMaxY / 32));
        const minCX = Math.max(0, Math.floor(bMinX / 32));
        const maxCX = Math.min(this.chunksX - 1, Math.floor(bMaxX / 32));

        const startCY = Math.random() > 0.5 ? minCY : maxCY;
        const endCY = startCY === minCY ? maxCY + 1 : minCY - 1;
        const stepCY = startCY === minCY ? 1 : -1;

        const startCX = Math.random() > 0.5 ? minCX : maxCX;
        const endCX = startCX === minCX ? maxCX + 1 : minCX - 1;
        const stepCX = startCX === minCX ? 1 : -1;

        for (let chunkY = startCY; chunkY !== endCY; chunkY += stepCY) {
            for (let chunkX = startCX; chunkX !== endCX; chunkX += stepCX) {
                const cIdx = chunkY * this.chunksX + chunkX;
                if (this.chunkActive[cIdx] === 0) continue;

                let chunkMoved = false;
                const cMinY = Math.max(bMinY, chunkY * 32);
                const cMaxY = Math.min(bMaxY, chunkY * 32 + 31);
                const cMinX = Math.max(bMinX, chunkX * 32);
                const cMaxX = Math.min(bMaxX, chunkX * 32 + 31);

                const startY = Math.random() > 0.5 ? cMinY : cMaxY;
                const endY = startY === cMinY ? cMaxY + 1 : cMinY - 1;
                const stepY = startY === cMinY ? 1 : -1;

                const startX = Math.random() > 0.5 ? cMinX : cMaxX;
                const endX = startX === cMinX ? cMaxX + 1 : cMinX - 1;
                const stepX = startX === cMinX ? 1 : -1;

                for (let y = startY; y !== endY; y += stepY) {
                    for (let x = startX; x !== endX; x += stepX) {
                        const idx = y * w + x;
                        const mat = this.data[idx];

                // 0. Boundary Cosmic Vacuum Absorption: Remove escaping matter at the outer grid borders
                if (x <= 2 || x >= w - 3 || y <= 2 || y >= h - 3) {
                    if (mat !== MAT.AIR && mat !== MAT.BEDROCK) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                    }
                    continue;
                }

                // Static Non-reactive Solids & Insulator
                if (mat === MAT.AIR || mat === MAT.BEDROCK || mat === MAT.STONE || mat === MAT.OBSIDIAN || mat === MAT.GLASS || mat === MAT.DIAMOND || mat === MAT.BRICK || mat === MAT.INSL) {
                    continue;
                }

                // Conductors refractory cooldown tick
                if (this.life[idx] > 0 && (mat === MAT.METAL || mat === MAT.MERC || mat === MAT.PSCN || mat === MAT.NSCN || mat === MAT.SWCH || mat === MAT.TESL || mat === MAT.LCRY)) {
                    this.life[idx]--;
                    if (mat === MAT.LCRY && this.life[idx] === 0) {
                        this.colors[idx] = MAT_PROPS[MAT.LCRY].color; // Dim LCD back to dark
                    }
                    if (mat === MAT.METAL || mat === MAT.PSCN || mat === MAT.NSCN || mat === MAT.SWCH || mat === MAT.TESL || mat === MAT.LCRY) {
                        continue;
                    }
                } else if (mat === MAT.METAL || mat === MAT.PSCN || mat === MAT.NSCN || mat === MAT.SWCH || mat === MAT.TESL || mat === MAT.LCRY) {
                    continue;
                }

                // 0. ELECTRONICS & WIRE LOGIC CA
                // 0A. BATTERY (Constant Power Source)
                if (mat === MAT.BATT) {
                    if (Math.random() < 0.45) {
                        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];
                        for (const [ox, oy] of offsets) {
                            const nx = x + ox;
                            const ny = y + oy;
                            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                                const nIdx = ny * w + nx;
                                const nMat = data[nIdx];
                                if (nMat === MAT.METAL || nMat === MAT.MERC || nMat === MAT.PSCN || nMat === MAT.TESL || nMat === MAT.LCRY || (nMat === MAT.SWCH && this.swchState[nIdx] === 1)) {
                                    if (this.life[nIdx] === 0) {
                                        this.sparkCell(nx, ny, nMat);
                                    }
                                }
                            }
                        }
                    }
                    continue;
                }

                // 0B. SPARK (Electrical Current Propagation & Semiconductor Logic)
                if (mat === MAT.SPRK) {
                    this.life[idx]--;
                    if (this.life[idx] >= 2) {
                        this.colors[idx] = Math.random() < 0.5 ? 0xFF33FFFF : 0xFFFFFFFF;
                        const myCtype = this.ctype[idx];
                        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];
                        for (const [ox, oy] of offsets) {
                            const nx = x + ox;
                            const ny = y + oy;
                            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
                            const nIdx = ny * w + nx;
                            const nMat = data[nIdx];

                            if (nMat === MAT.AIR || nMat === MAT.BEDROCK || nMat === MAT.INSL || nMat === MAT.SPRK) continue;

                            // Combustibles & Explosives ignite on spark
                            if (nMat === MAT.GUNPOWDER || nMat === MAT.NITRO || nMat === MAT.C4 || nMat === MAT.THERMITE || nMat === MAT.METN || nMat === MAT.HYGN || nMat === MAT.OIL) {
                                this.setMat(nx, ny, MAT.FIRE);
                                continue;
                            }

                            if (nMat === MAT.EMP) {
                                this.triggerEMP(nx, ny);
                                continue;
                            }

                            // Conductors propagation
                            if (nMat === MAT.METAL || nMat === MAT.MERC) {
                                if (this.life[nIdx] === 0) this.sparkCell(nx, ny, nMat);
                            } else if (nMat === MAT.PSCN) {
                                if (this.life[nIdx] === 0) this.sparkCell(nx, ny, nMat);
                            } else if (nMat === MAT.NSCN) {
                                // NSCN ONLY accepts spark from PSCN or BATT!
                                if ((myCtype === MAT.PSCN || myCtype === MAT.BATT) && this.life[nIdx] === 0) {
                                    this.sparkCell(nx, ny, nMat);
                                }
                            } else if (nMat === MAT.SWCH) {
                                if (myCtype === MAT.PSCN) {
                                    this.swchState[nIdx] = 1; // Turn ON
                                    this.colors[nIdx] = 0xFF20FF40;
                                } else if (myCtype === MAT.NSCN) {
                                    this.swchState[nIdx] = 0; // Turn OFF
                                    this.colors[nIdx] = 0xFF2060B0;
                                }
                                if (this.swchState[nIdx] === 1 && this.life[nIdx] === 0) {
                                    this.sparkCell(nx, ny, nMat);
                                }
                            } else if (nMat === MAT.TESL) {
                                if (this.life[nIdx] === 0) {
                                    this.sparkCell(nx, ny, nMat);
                                    // Shoot lightning bolt outward
                                    const tAngle = Math.random() * Math.PI * 2;
                                    const lx = Math.round(nx + Math.cos(tAngle) * 2);
                                    const ly = Math.round(ny + Math.sin(tAngle) * 2);
                                    if (lx >= 0 && lx < w && ly >= 0 && ly < h && data[ly * w + lx] === MAT.AIR) {
                                        this.setMat(lx, ly, MAT.ELEC);
                                    }
                                }
                            } else if (nMat === MAT.LCRY) {
                                if (this.life[nIdx] === 0) {
                                    this.sparkCell(nx, ny, nMat);
                                    this.colors[nIdx] = 0xFFFFFF66;
                                }
                            }
                        }
                    }

                    if (this.life[idx] <= 0) {
                        // Spark dies: revert back to ctype with 3 ticks refractory cooldown
                        const orig = this.ctype[idx] || MAT.METAL;
                        this.data[idx] = orig;
                        this.life[idx] = 3;
                        if (orig === MAT.SWCH) {
                            this.colors[idx] = this.swchState[idx] === 1 ? 0xFF20FF40 : 0xFF2060B0;
                        } else if (orig === MAT.LCRY) {
                            this.colors[idx] = 0xFFFFFF66;
                        } else {
                            this.colors[idx] = this.getVariedColor(orig, idx);
                        }
                        moved = true;
                    }
                    continue;
                }

                // 0C. SENSOR / DETECTOR
                if (mat === MAT.DET) {
                    let detected = false;
                    for (let dy = -3; dy <= 3 && !detected; dy++) {
                        for (let dx = -3; dx <= 3; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const tx = x + dx;
                            const ty = y + dy;
                            if (tx >= 0 && tx < w && ty >= 0 && ty < h) {
                                const tMat = data[ty * w + tx];
                                if (tMat !== MAT.AIR && tMat !== MAT.BEDROCK && tMat !== MAT.INSL && tMat !== MAT.DET) {
                                    detected = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (detected) {
                        this.colors[idx] = 0xFF00FFFF;
                        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                        for (const [ox, oy] of offsets) {
                            const nx = x + ox;
                            const ny = y + oy;
                            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                                const nMat = data[ny * w + nx];
                                if ((nMat === MAT.METAL || nMat === MAT.MERC || nMat === MAT.PSCN || nMat === MAT.TESL || nMat === MAT.LCRY || (nMat === MAT.SWCH && this.swchState[ny * w + nx] === 1)) && this.life[ny * w + nx] === 0) {
                                    this.sparkCell(nx, ny, nMat);
                                }
                            }
                        }
                    } else {
                        this.colors[idx] = MAT_PROPS[MAT.DET].color;
                    }
                    continue;
                }

                // 0D. LIGHTNING ARC / HIGH-VOLTAGE BOLT
                if (mat === MAT.ELEC) {
                    this.life[idx]--;
                    if (this.life[idx] <= 0) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }
                    const edx = Math.round((Math.random() - 0.5) * 4);
                    const edy = Math.round((Math.random() - 0.5) * 4);
                    const ex = x + edx;
                    const ey = y + edy;
                    if (ex <= 2 || ex >= w - 3 || ey <= 2 || ey >= h - 3) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }
                    if (ex >= 0 && ex < w && ey >= 0 && ey < h) {
                        const eMat = data[ey * w + ex];
                        if (eMat === MAT.AIR) {
                            this.swap(x, y, ex, ey);
                            moved = true;
                        } else if (eMat === MAT.METAL || eMat === MAT.MERC || eMat === MAT.PSCN || eMat === MAT.NSCN || eMat === MAT.SWCH || eMat === MAT.TESL || eMat === MAT.LCRY) {
                            this.sparkCell(ex, ey, eMat);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                        } else if (eMat === MAT.GUNPOWDER || eMat === MAT.NITRO || eMat === MAT.C4 || eMat === MAT.METN || eMat === MAT.HYGN) {
                            this.setMat(ex, ey, MAT.FIRE);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                        } else if (eMat === MAT.SAND) {
                            this.setMat(ex, ey, MAT.GLASS);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                        } else if (eMat === MAT.WATER) {
                            this.setMat(ex, ey, MAT.STEAM);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                        }
                    }
                    continue;
                }

                // 1. VOID LOGIC (Devours adjacent matter with stochastic check)
                if (mat === MAT.VOID) {
                    if (Math.random() < 0.35) {
                        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                        for (const [ox, oy] of offsets) {
                            const nx = x + ox;
                            const ny = y + oy;
                            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                                const nIdx = ny * w + nx;
                                const nMat = data[nIdx];
                                if (nMat !== MAT.AIR && nMat !== MAT.BEDROCK && nMat !== MAT.VOID) {
                                    this.setMat(nx, ny, MAT.AIR);
                                    moved = true;
                                }
                            }
                        }
                    }
                    continue;
                }

                // 2. CLONE LOGIC (Duplicates touched matter)
                if (mat === MAT.CLNE) {
                    const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                    let cloneTarget = MAT.AIR;
                    for (const [ox, oy] of offsets) {
                        const nx = x + ox;
                        const ny = y + oy;
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                            const nMat = data[ny * w + nx];
                            if (nMat !== MAT.AIR && nMat !== MAT.CLNE && nMat !== MAT.VOID && nMat !== MAT.BEDROCK) {
                                cloneTarget = nMat;
                                break;
                            }
                        }
                    }
                    if (cloneTarget !== MAT.AIR) {
                        for (const [ox, oy] of offsets) {
                            const nx = x + ox;
                            const ny = y + oy;
                            if (nx >= 0 && nx < w && ny >= 0 && ny < h && data[ny * w + nx] === MAT.AIR) {
                                this.setMat(nx, ny, cloneTarget);
                                moved = true;
                            }
                        }
                    }
                    continue;
                }

                // 3. BLACK HOLE & WHITE HOLE GRAVITY SINGULARITIES
                if (mat === MAT.BHOL || mat === MAT.WHOL) {
                    const radius = 6;
                    const pull = (mat === MAT.BHOL);
                    let annihilated = false;

                    if (Math.random() < 0.35) {
                        for (let dy = -radius; dy <= radius && !annihilated; dy++) {
                            for (let dx = -radius; dx <= radius; dx++) {
                                if (dx === 0 && dy === 0) continue;
                                const dist = Math.hypot(dx, dy);
                                if (dist > radius) continue;
                                const tx = x + dx;
                                const ty = y + dy;
                                if (tx >= 0 && tx < w && ty >= 0 && ty < h) {
                                    const tIdx = ty * w + tx;
                                    const tMat = data[tIdx];

                                    // Singularity Annihilation: BHOL meets WHOL -> Cosmic Supernova!
                                    if ((mat === MAT.BHOL && tMat === MAT.WHOL) || (mat === MAT.WHOL && tMat === MAT.BHOL)) {
                                        if (dist <= 3.0) {
                                            this.setMat(x, y, MAT.PLSM);
                                            this.setMat(tx, ty, MAT.PLSM);
                                            this.carveExplosion(this.gridToWorld(x, y).x, this.gridToWorld(x, y).y, 65, { isMagma: true, pushPower: 3.5 });
                                            for (let k = 0; k < 12; k++) {
                                                const a = (k / 12) * Math.PI * 2;
                                                const rx = Math.round(x + Math.cos(a) * 4);
                                                const ry = Math.round(y + Math.sin(a) * 4);
                                                if (rx >= 0 && rx < w && ry >= 0 && ry < h) {
                                                    this.setMat(rx, ry, Math.random() < 0.5 ? MAT.NEUT : MAT.PHOT);
                                                }
                                            }
                                            annihilated = true;
                                            moved = true;
                                            break;
                                        }
                                    }

                                    if (tMat !== MAT.AIR && tMat !== MAT.BEDROCK && tMat !== MAT.BHOL && tMat !== MAT.WHOL) {
                                        if (pull && dist <= 1.5) {
                                            this.setMat(tx, ty, MAT.AIR);
                                            // Hawking radiation emission
                                            if (Math.random() < 0.1) {
                                                const hAngle = Math.random() * Math.PI * 2;
                                                const hx = Math.round(x + Math.cos(hAngle) * 2);
                                                const hy = Math.round(y + Math.sin(hAngle) * 2);
                                                if (hx >= 0 && hx < w && hy >= 0 && hy < h && data[hy * w + hx] === MAT.AIR) {
                                                    this.setMat(hx, hy, MAT.PHOT);
                                                }
                                            }
                                        } else if (Math.random() < 0.35) {
                                            const stepPullX = pull ? -Math.sign(dx) : Math.sign(dx);
                                            const stepPullY = pull ? -Math.sign(dy) : Math.sign(dy);
                                            const nextX = tx + stepPullX;
                                            const nextY = ty + stepPullY;
                                            if (nextX >= 0 && nextX < w && nextY >= 0 && nextY < h && data[nextY * w + nextX] === MAT.AIR) {
                                                this.swap(tx, ty, nextX, nextY);
                                                moved = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (annihilated) continue;

                    // White Hole Fountain: Emits Gravitite & Photons
                    if (mat === MAT.WHOL && Math.random() < 0.04) {
                        const outA = Math.random() * Math.PI * 2;
                        const ox = Math.round(x + Math.cos(outA) * 2);
                        const oy = Math.round(y + Math.sin(outA) * 2);
                        if (ox >= 0 && ox < w && oy >= 0 && oy < h && data[oy * w + ox] === MAT.AIR) {
                            this.setMat(ox, oy, Math.random() < 0.5 ? MAT.GRAVITITE : MAT.PHOT);
                            moved = true;
                        }
                    }
                    continue;
                }

                // 4. URANIUM RADIOACTIVE SPONTANEOUS DECAY
                if (mat === MAT.URAN) {
                    if (Math.random() < 0.004) {
                        const deg = Math.random() * Math.PI * 2;
                        const rx = Math.round(x + Math.cos(deg) * 2);
                        const ry = Math.round(y + Math.sin(deg) * 2);
                        if (rx >= 0 && rx < w && ry >= 0 && ry < h && data[ry * w + rx] === MAT.AIR) {
                            this.setMat(rx, ry, MAT.NEUT);
                            moved = true;
                        }
                    }
                    continue;
                }

                // 5. NEUTRON PARTICLE PROPAGATION & NUCLEAR MODERATION / FISSION
                if (mat === MAT.NEUT) {
                    this.life[idx]--;
                    if (this.life[idx] <= 0) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }
                    const ndx = (x - cx) || (Math.random() - 0.5);
                    const ndy = (y - cy) || (Math.random() - 0.5);
                    const nDist = Math.hypot(ndx, ndy) || 1;
                    const nDirX = ndx / nDist;
                    const nDirY = ndy / nDist;
                    const nStepX = Math.random() < Math.abs(nDirX) ? Math.sign(nDirX) : 0;
                    const nStepY = Math.random() < Math.abs(nDirY) ? Math.sign(nDirY) : 0;
                    const nNextX = x + (nStepX || Math.sign(nDirX));
                    const nNextY = y + (nStepY || Math.sign(nDirY));

                    if (nNextX <= 2 || nNextX >= w - 3 || nNextY <= 2 || nNextY >= h - 3) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }

                    if (nNextX >= 0 && nNextX < w && nNextY >= 0 && nNextY < h) {
                        const targetMat = data[nNextY * w + nNextX];
                        if (targetMat === MAT.URAN) {
                            // Fission chain reaction explosion!
                            this.setMat(nNextX, nNextY, MAT.PLSM);
                            this.carveExplosion(this.gridToWorld(nNextX, nNextY).x, this.gridToWorld(nNextX, nNextY).y, 38, { isMagma: true, pushPower: 2.2 });
                            for (let k = 0; k < 4; k++) {
                                const kAngle = (k / 4) * Math.PI * 2;
                                const spX = Math.round(nNextX + Math.cos(kAngle) * 2);
                                const spY = Math.round(nNextY + Math.sin(kAngle) * 2);
                                if (spX >= 0 && spX < w && spY >= 0 && spY < h) {
                                    this.setMat(spX, spY, MAT.NEUT);
                                }
                            }
                            moved = true;
                            continue;
                        } else if (targetMat === MAT.WATER) {
                            // Cherenkov Neutron Moderator: Absorbs radiation peacefully, heats to steam
                            if (Math.random() < 0.25) this.setMat(nNextX, nNextY, MAT.STEAM);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                            continue;
                        } else if (targetMat === MAT.METN) {
                            // Radiolytic Cracking: Splits methane into free Hydrogen + Coal
                            this.setMat(nNextX, nNextY, MAT.HYGN);
                            this.setMat(x, y, MAT.COAL);
                            moved = true;
                            continue;
                        } else if (targetMat === MAT.C4 || targetMat === MAT.NITRO || targetMat === MAT.GUNPOWDER) {
                            // Instant nuclear detonation
                            this.setMat(nNextX, nNextY, MAT.PLSM);
                            this.carveExplosion(this.gridToWorld(nNextX, nNextY).x, this.gridToWorld(nNextX, nNextY).y, 36);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                            continue;
                        } else if (targetMat === MAT.METAL || targetMat === MAT.MERC) {
                            // Electromagnetic induction spark
                            this.sparkCell(nNextX, nNextY, targetMat);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                            continue;
                        } else if (targetMat === MAT.DIAMOND) {
                            // High-energy plasma ionization
                            if (Math.random() < 0.15) this.setMat(nNextX, nNextY, MAT.PLSM);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                            continue;
                        } else if (targetMat === MAT.STONE || targetMat === MAT.SAND || targetMat === MAT.DIRT) {
                            // Neutron Activation / Transmutation into Uranium
                            if (Math.random() < 0.08) {
                                this.setMat(nNextX, nNextY, MAT.URAN);
                            } else if (Math.random() < 0.2) {
                                this.setMat(nNextX, nNextY, MAT.AIR);
                            }
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                            continue;
                        } else if (targetMat === MAT.AIR) {
                            this.swap(x, y, nNextX, nNextY);
                            moved = true;
                        } else if (targetMat !== MAT.BEDROCK) {
                            if (Math.random() < 0.3) this.setMat(nNextX, nNextY, MAT.AIR);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                        }
                    }
                    continue;
                }

                // 6. PHOTON LASER BEAM & PHOTOELECTRIC SOLAR LOGIC
                if (mat === MAT.PHOT) {
                    this.life[idx]--;
                    if (this.life[idx] <= 0) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }
                    const pdx = (x - cx) || 1;
                    const pdy = (y - cy) || 1;
                    const pDist = Math.hypot(pdx, pdy) || 1;
                    const pDirX = pdx / pDist;
                    const pDirY = pdy / pDist;
                    const pStepX = Math.random() < Math.abs(pDirX) ? Math.sign(pDirX) : 0;
                    const pStepY = Math.random() < Math.abs(pDirY) ? Math.sign(pDirY) : 0;
                    const pNextX = x + (pStepX || Math.sign(pDirX));
                    const pNextY = y + (pStepY || Math.sign(pDirY));

                    if (pNextX <= 2 || pNextX >= w - 3 || pNextY <= 2 || pNextY >= h - 3) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }

                    if (pNextX >= 0 && pNextX < w && pNextY >= 0 && pNextY < h) {
                        const targetMat = data[pNextY * w + pNextX];

                        // 6A. Photoelectric Solar Power on Semiconductors
                        if (targetMat === MAT.PSCN || targetMat === MAT.NSCN) {
                            this.sparkCell(pNextX, pNextY, targetMat);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                            continue;
                        }

                        // 6B. Photofission on Uranium
                        if (targetMat === MAT.URAN) {
                            this.setMat(pNextX, pNextY, MAT.PLSM);
                            this.setMat(x, y, MAT.NEUT);
                            this.carveExplosion(this.gridToWorld(pNextX, pNextY).x, this.gridToWorld(pNextX, pNextY).y, 30);
                            moved = true;
                            continue;
                        }

                        // 6C. Liquid Crystal Illumination
                        if (targetMat === MAT.LCRY) {
                            this.colors[pNextY * w + pNextX] = 0xFFFFFF66;
                            this.life[pNextY * w + pNextX] = 5;
                        }

                        // 6D. Photosynthesis Stimulation
                        if (targetMat === MAT.FLORA) {
                            if (Math.random() < 0.35) {
                                const fx = pNextX + Math.sign(pNextX - cx);
                                const fy = pNextY + Math.sign(pNextY - cy);
                                if (fx >= 0 && fx < w && fy >= 0 && fy < h && (data[fy * w + fx] === MAT.AIR || data[fy * w + fx] === MAT.DIRT || data[fy * w + fx] === MAT.MUD)) {
                                    this.setMat(fx, fy, MAT.FLORA);
                                }
                            }
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                            continue;
                        }

                        // 6E. Pyrotechnic Laser Fireworks Trigger
                        if (targetMat === MAT.FWRK) {
                            this.setMat(pNextX, pNextY, MAT.AIR);
                            const sparkColors = [0xFFFF0044, 0xFF00FF00, 0xFF00FFFF, 0xFFFF00FF, 0xFFFFFF00, 0xFFFF8800, 0xFFE0FFFF];
                            const { x: wx, y: wy } = this.gridToWorld(pNextX, pNextY);
                            for (let k = 0; k < 20; k++) {
                                const angle = (k / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
                                const speed = 150 + Math.random() * 250;
                                const sparkCol = sparkColors[Math.floor(Math.random() * sparkColors.length)];
                                this.spawnOrbitalParticle(wx, wy, Math.cos(angle) * speed, Math.sin(angle) * speed, MAT.FIRE, sparkCol);
                            }
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                            continue;
                        }

                        // 6F. Specular & Refractive Mirror Optics
                        if (targetMat === MAT.MERC || targetMat === MAT.GLASS || targetMat === MAT.DIAMOND) {
                            const refX = x - Math.sign(pDirY);
                            const refY = y + Math.sign(pDirX);
                            if (refX >= 0 && refX < w && refY >= 0 && refY < h && data[refY * w + refX] === MAT.AIR) {
                                this.swap(x, y, refX, refY);
                                moved = true;
                            }
                        } else if (targetMat === MAT.AIR) {
                            this.swap(x, y, pNextX, pNextY);
                            moved = true;
                        } else {
                            if (targetMat === MAT.ICE || targetMat === MAT.SNOW) this.setMat(pNextX, pNextY, MAT.WATER);
                            else if (targetMat === MAT.WOOD || targetMat === MAT.OIL || targetMat === MAT.METN || targetMat === MAT.HYGN) this.setMat(pNextX, pNextY, MAT.FIRE);
                            this.setMat(x, y, MAT.AIR);
                            moved = true;
                        }
                    }
                    continue;
                }

                // 7. PLASMA IONIZED MATTER (Fusion Star Matter)
                if (mat === MAT.PLSM) {
                    this.life[idx]--;
                    if (this.life[idx] <= 0) {
                        this.setMat(x, y, Math.random() < 0.4 ? MAT.FIRE : MAT.AIR);
                        moved = true;
                        continue;
                    }
                    if (Math.random() < 0.20) {
                        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                        for (const [ox, oy] of offsets) {
                            const nx = x + ox;
                            const ny = y + oy;
                            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                                const nMat = data[ny * w + nx];
                                if (nMat === MAT.STONE || nMat === MAT.BRICK || nMat === MAT.METAL) {
                                    this.setMat(nx, ny, MAT.LAVA);
                                } else if (nMat === MAT.SAND) {
                                    this.setMat(nx, ny, MAT.GLASS);
                                } else if (nMat === MAT.WATER || nMat === MAT.ICE || nMat === MAT.SNOW) {
                                    this.setMat(nx, ny, MAT.STEAM);
                                } else if (nMat === MAT.WOOD || nMat === MAT.FLORA || nMat === MAT.OIL || nMat === MAT.GUNPOWDER) {
                                    this.setMat(nx, ny, MAT.FIRE);
                                } else if (nMat === MAT.DIAMOND && Math.random() < 0.05) {
                                    this.setMat(nx, ny, MAT.CO2); // Diamond burns into CO2 under plasma
                                }
                            }
                        }
                    }
                    const gdx = x - cx;
                    const gdy = y - cy;
                    const gDist = Math.sqrt(gdx * gdx + gdy * gdy) || 1;
                    const gOutX = gdx / gDist;
                    const gOutY = gdy / gDist;
                    const tDir = Math.random() > 0.5 ? 1 : -1;
                    const moveX = gOutX + (Math.random() < 0.35 ? -gOutY * tDir * 0.5 : 0);
                    const moveY = gOutY + (Math.random() < 0.35 ? gOutX * tDir * 0.5 : 0);
                    let stepX = Math.random() < Math.abs(moveX) ? Math.sign(moveX) : 0;
                    let stepY = Math.random() < Math.abs(moveY) ? Math.sign(moveY) : 0;
                    if (stepX === 0 && stepY === 0) {
                        stepX = Math.abs(moveX) >= Math.abs(moveY) ? Math.sign(moveX) : 0;
                        stepY = Math.abs(moveY) > Math.abs(moveX) ? Math.sign(moveY) : 0;
                    }
                    const rX = x + stepX;
                    const rY = y + stepY;
                    if (rX <= 2 || rX >= w - 3 || rY <= 2 || rY >= h - 3) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }
                    if (rX >= 0 && rX < w && rY >= 0 && rY < h && data[rY * w + rX] === MAT.AIR) {
                        this.swap(x, y, rX, rY);
                        moved = true;
                    }
                    continue;
                }

                // 8. FIRE LOGIC & COMBUSITON (Isotropic continuous radial flame rise)
                if (mat === MAT.FIRE) {
                    this.life[idx]--;
                    if (this.life[idx] <= 0) {
                        this.setMat(x, y, Math.random() < 0.25 ? MAT.STEAM : MAT.AIR);
                        moved = true;
                        continue;
                    }
                    this.checkFireNeighbors(x, y);
                    const gdx = x - cx;
                    const gdy = y - cy;
                    const gDist = Math.sqrt(gdx * gdx + gdy * gdy) || 1;
                    const gOutX = gdx / gDist;
                    const gOutY = gdy / gDist;
                    const tDir = Math.random() > 0.5 ? 1 : -1;
                    const moveX = gOutX + (Math.random() < 0.4 ? -gOutY * tDir * 0.55 : 0);
                    const moveY = gOutY + (Math.random() < 0.4 ? gOutX * tDir * 0.55 : 0);
                    let stepX = Math.random() < Math.abs(moveX) ? Math.sign(moveX) : 0;
                    let stepY = Math.random() < Math.abs(moveY) ? Math.sign(moveY) : 0;
                    if (stepX === 0 && stepY === 0) {
                        stepX = Math.abs(moveX) >= Math.abs(moveY) ? Math.sign(moveX) : 0;
                        stepY = Math.abs(moveY) > Math.abs(moveX) ? Math.sign(moveY) : 0;
                    }
                    const rX = x + stepX;
                    const rY = y + stepY;
                    if (rX <= 2 || rX >= w - 3 || rY <= 2 || rY >= h - 3) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }
                    if (rX >= 0 && rX < w && rY >= 0 && rY < h && data[rY * w + rX] === MAT.AIR) {
                        this.swap(x, y, rX, rY);
                        moved = true;
                    }
                    continue;
                }

                // 9. ATMOSPHERIC GASES (STEAM, SMOKE, METHANE, OXYGEN, HYDROGEN, CO2) - 360° Isotropic Plumes
                if (mat === MAT.STEAM || mat === MAT.SMOKE || mat === MAT.METN || mat === MAT.OXYG || mat === MAT.HYGN || mat === MAT.CO2) {
                    this.life[idx]--;
                    if (this.life[idx] <= 0) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }

                    const isSinking = (mat === MAT.CO2);
                    const gdx = x - cx;
                    const gdy = y - cy;
                    const gDist = Math.sqrt(gdx * gdx + gdy * gdy) || 1;
                    const gOutX = gdx / gDist;
                    const gOutY = gdy / gDist;
                    const dirMult = isSinking ? -1 : 1;

                    // Swirling atmospheric turbulence
                    const tDir = Math.random() > 0.5 ? 1 : -1;
                    const moveX = gOutX * dirMult + (Math.random() < 0.45 ? -gOutY * tDir * 0.6 : 0);
                    const moveY = gOutY * dirMult + (Math.random() < 0.45 ? gOutX * tDir * 0.6 : 0);

                    let stepX = Math.random() < Math.abs(moveX) ? Math.sign(moveX) : 0;
                    let stepY = Math.random() < Math.abs(moveY) ? Math.sign(moveY) : 0;
                    if (stepX === 0 && stepY === 0) {
                        stepX = Math.abs(moveX) >= Math.abs(moveY) ? Math.sign(moveX) : 0;
                        stepY = Math.abs(moveY) > Math.abs(moveX) ? Math.sign(moveY) : 0;
                    }

                    const rX = x + stepX;
                    const rY = y + stepY;
                    if (rX <= 2 || rX >= w - 3 || rY <= 2 || rY >= h - 3) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }
                    if (rX >= 0 && rX < w && rY >= 0 && rY < h && data[rY * w + rX] === MAT.AIR) {
                        this.swap(x, y, rX, rY);
                        moved = true;
                    }
                    continue;
                }

                // 10. FLORA CONTINUOUS VEGETATIVE GROWTH LOGIC
                if (mat === MAT.FLORA) {
                    // Check nearby cells for soil (DIRT) or moisture (WATER/MUD)
                    const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                    let hasSoil = false;
                    let hasMoisture = false;
                    for (const [ox, oy] of offsets) {
                        const nx = x + ox;
                        const ny = y + oy;
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                            const nm = data[ny * w + nx];
                            if (nm === MAT.DIRT || nm === MAT.MUD) hasSoil = true;
                            if (nm === MAT.WATER || nm === MAT.MUD) hasMoisture = true;
                        }
                    }

                    // Flora naturally grows over time, accelerated by soil and water
                    const growChance = hasMoisture ? 0.08 : (hasSoil ? 0.03 : 0.008);
                    if (Math.random() < growChance) {
                        const upX = Math.sign(x - cx);
                        const upY = Math.sign(y - cy);
                        const tDir = Math.random() > 0.5 ? 1 : -1;
                        const sideX = -upY * tDir;
                        const sideY = upX * tDir;

                        const roll = Math.random();
                        const gx = x + (roll < 0.55 ? upX : (roll < 0.85 ? sideX : (Math.random() > 0.5 ? 1 : -1)));
                        const gy = y + (roll < 0.55 ? upY : (roll < 0.85 ? sideY : (Math.random() > 0.5 ? 1 : -1)));

                        if (gx >= 0 && gx < w && gy >= 0 && gy < h) {
                            const gMat = data[gy * w + gx];
                            if (gMat === MAT.AIR) {
                                this.setMat(gx, gy, MAT.FLORA);
                                moved = true;
                                chunkMoved = true;
                            } else if (gMat === MAT.DIRT && Math.random() < 0.35) {
                                // Plant roots convert underlying dirt into strong wood
                                this.setMat(gx, gy, MAT.WOOD);
                                moved = true;
                                chunkMoved = true;
                            }
                        }
                    }
                    continue;
                }

                // 11. CONTINUOUS ISOTROPIC RADIAL GRAVITY & CIRCULAR FLUID LEVELING
                const dx = cx - x;
                const dy = cy - y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 1) continue;
                const currentR = Math.sqrt(distSq);

                // Lava acts as a continuous thermal ignition source like fire
                if (mat === MAT.LAVA) {
                    this.checkFireNeighbors(x, y, MAT.LAVA);
                }

                if (this.checkChemicalReactions(x, y, mat)) {
                    moved = true;
                    continue;
                }

                const isInv = (mat === MAT.GRAVITITE || this.gravityInverted);
                const isLiquid = MAT_PROPS[mat].liquid;
                const myDensity = MAT_PROPS[mat].density;

                // Continuous normalized radial and tangential vectors
                const invR = 1.0 / currentR;
                const radX = (isInv ? -dx : dx) * invR;
                const radY = (isInv ? -dy : dy) * invR;

                // Tangent vector perpendicular to radial gravity (CW or CCW)
                const tangDir = Math.random() > 0.5 ? 1 : -1;
                const tangX = -radY * tangDir;
                const tangY = radX * tangDir;

                // 11a. Primary Inward Fall & Relative Density Displacement
                let stepX = Math.random() < Math.abs(radX) ? Math.sign(radX) : 0;
                let stepY = Math.random() < Math.abs(radY) ? Math.sign(radY) : 0;

                if (stepX === 0 && stepY === 0) {
                    if (Math.abs(radX) >= Math.abs(radY)) {
                        stepX = Math.sign(radX);
                    } else {
                        stepY = Math.sign(radY);
                    }
                }

                const targetX = x + stepX;
                const targetY = y + stepY;

                // Escape deletion if escaping outward past universe boundary
                if (targetX <= 2 || targetX >= w - 3 || targetY <= 2 || targetY >= h - 3) {
                    if (isInv || myDensity < 0) {
                        this.setMat(x, y, MAT.AIR);
                        moved = true;
                        continue;
                    }
                }

                if (targetX >= 0 && targetX < w && targetY >= 0 && targetY < h) {
                    const targetIdx = targetY * w + targetX;
                    const targetMat = data[targetIdx];
                    const tdx = cx - targetX;
                    const tdy = cy - targetY;
                    const targetDistSq = tdx * tdx + tdy * tdy;
                    const isFallingCloser = isInv ? (targetDistSq > distSq - currentR * 0.2) : (targetDistSq < distSq + currentR * 0.2);

                    if (targetMat === MAT.AIR) {
                        if (isFallingCloser) {
                            this.swap(x, y, targetX, targetY);
                            moved = true;
                            continue;
                        }
                    } else if (isFallingCloser) {
                        // Density Buoyancy Displacement: Heavier materials push inward and displace lighter fluids/gases/powders outward
                        const targetProps = MAT_PROPS[targetMat];
                        if (!targetProps.solid || targetProps.liquid || targetProps.gas) {
                            if (myDensity > targetProps.density) {
                                const dispChance = (targetProps.liquid || targetProps.gas) ? 0.85 : 0.40;
                                if (Math.random() < dispChance) {
                                    this.swap(x, y, targetX, targetY);
                                    moved = true;
                                    continue;
                                }
                            }
                        }
                    }
                }

                // 11b. Secondary Tangential Flow & High-Velocity Fluid Leveling
                if (isLiquid) {
                    const maxDisp = MAT_PROPS[mat].dispersion || 5;
                    let liquidMoved = false;

                    // Raycast along continuous circular tangent from maxDisp down to 1
                    for (let dist = maxDisp; dist >= 1; dist--) {
                        const tStepX = Math.round(tangX * dist);
                        const tStepY = Math.round(tangY * dist);
                        const tX = x + tStepX;
                        const tY = y + tStepY;

                        if (tX >= 0 && tX < w && tY >= 0 && tY < h) {
                            const tIdx = tY * w + tX;
                            const tMat = data[tIdx];

                            if (tMat === MAT.AIR) {
                                const tdx = cx - tX;
                                const tdy = cy - tY;
                                const tDistSq = tdx * tdx + tdy * tdy;
                                // Fluid immediately drops into surface depressions (lower r) or flows smoothly along circular contour (r <= currentR + 0.35)
                                if (tDistSq < distSq - currentR * 0.1 || tDistSq <= distSq + currentR * 0.7 + 0.15) {
                                    this.swap(x, y, tX, tY);
                                    moved = true;
                                    liquidMoved = true;
                                    break;
                                }
                            } else if ((MAT_PROPS[tMat].liquid || MAT_PROPS[tMat].gas) && myDensity > MAT_PROPS[tMat].density) {
                                // Density displacement (e.g. Mercury > Lava > Acid > Water > Soap > LN2 > Oil > Gases)
                                this.swap(x, y, tX, tY);
                                moved = true;
                                liquidMoved = true;
                                break;
                            }
                        }
                    }
                    if (liquidMoved) continue;
                } else if (Math.random() < 0.5) {
                    // Powder Angle of Repose & Liquid Submersion
                    const pDisp = MAT_PROPS[mat].dispersion || 1;
                    for (let dist = pDisp; dist >= 1; dist--) {
                        const diagX = Math.round(radX * dist + tangX * dist * 0.85);
                        const diagY = Math.round(radY * dist + tangY * dist * 0.85);
                        const dX = x + (diagX !== 0 ? Math.sign(diagX) : 0);
                        const dY = y + (diagY !== 0 ? Math.sign(diagY) : 0);

                        if (dX >= 0 && dX < w && dY >= 0 && dY < h) {
                            const dIdx = dY * w + dX;
                            const dMat = data[dIdx];
                            const ddx = cx - dX;
                            const ddy = cy - dY;
                            const dDistSq = ddx * ddx + ddy * ddy;

                            if (dMat === MAT.AIR && dDistSq <= distSq + currentR * 0.4 + 0.04) {
                                this.swap(x, y, dX, dY);
                                moved = true;
                                chunkMoved = true;
                                break;
                            } else if (MAT_PROPS[dMat].liquid && myDensity > MAT_PROPS[dMat].density && dDistSq <= distSq + currentR * 0.2) {
                                // Heavy powders (e.g. Sand, Concrete, Thermite) sink diagonally into liquids
                                this.swap(x, y, dX, dY);
                                moved = true;
                                chunkMoved = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

                if (chunkMoved) {
                    this.wakeChunk(chunkX * 32 + 16, chunkY * 32 + 16);
                    moved = true;
                } else {
                    this.chunkActive[cIdx]--;
                }
            }
        }

        if (moved) this.isDirty = true;
    }

    swap(x1, y1, x2, y2) {
        if (x1 < 0 || x1 >= this.width || y1 < 0 || y1 >= this.height) return;
        if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height) return;

        const idx1 = y1 * this.width + x1;
        const idx2 = y2 * this.width + x2;

        const m1 = this.data[idx1];
        const c1 = this.colors[idx1];
        const l1 = this.life[idx1];

        this.data[idx1] = this.data[idx2];
        this.colors[idx1] = this.colors[idx2];
        this.life[idx1] = this.life[idx2];

        this.data[idx2] = m1;
        this.colors[idx2] = c1;
        this.life[idx2] = l1;

        this.wakeChunk(x1, y1);
        this.wakeChunk(x2, y2);
        this.isDirty = true;
    }

    emitGas(x, y, gasMat, count = 2) {
        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];
        let placed = 0;
        for (const [ox, oy] of offsets) {
            if (placed >= count) break;
            const gx = x + ox;
            const gy = y + oy;
            if (gx >= 0 && gx < this.width && gy >= 0 && gy < this.height && this.data[gy * this.width + gx] === MAT.AIR) {
                this.setMat(gx, gy, gasMat);
                placed++;
            }
        }
    }

    checkFireNeighbors(x, y, sourceMat = MAT.FIRE) {
        if (Math.random() > 0.30) return;
        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];
        for (const [ox, oy] of offsets) {
            const nx = x + ox;
            const ny = y + oy;
            if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) continue;
            const nIdx = ny * this.width + nx;
            const nMat = this.data[nIdx];

            if (nMat === MAT.OIL) {
                this.setMat(nx, ny, MAT.FIRE);
                this.emitGas(nx, ny, MAT.SMOKE, 3);
            } else if (nMat === MAT.GUNPOWDER) {
                this.setMat(nx, ny, MAT.FIRE);
                this.emitGas(nx, ny, MAT.SMOKE, 2);
            } else if (nMat === MAT.FLORA) {
                this.setMat(nx, ny, MAT.FIRE);
                this.emitGas(nx, ny, MAT.SMOKE, 2);
            } else if (nMat === MAT.WOOD) {
                this.setMat(nx, ny, MAT.FIRE);
                this.emitGas(nx, ny, MAT.SMOKE, 2);
                if (Math.random() < 0.25) this.setMat(x, y, MAT.COAL); // Charring into charcoal
            } else if (nMat === MAT.C4) {
                this.carveExplosion(this.gridToWorld(nx, ny).x, this.gridToWorld(nx, ny).y, 38, { pushPower: 2.2 });
                this.emitGas(nx, ny, MAT.SMOKE, 4);
            } else if (nMat === MAT.METN || nMat === MAT.HYGN) {
                // Volatile gas fireball detonation
                this.carveExplosion(this.gridToWorld(nx, ny).x, this.gridToWorld(nx, ny).y, 32, { pushPower: 1.8 });
                this.emitGas(nx, ny, MAT.STEAM, 3);
            } else if (nMat === MAT.OXYG) {
                // Oxygen flare acceleration into Plasma
                this.setMat(nx, ny, MAT.PLSM);
            } else if (nMat === MAT.FWRK) {
                // Launch pyrotechnic shower
                this.setMat(nx, ny, MAT.AIR);
                this.emitGas(nx, ny, MAT.SMOKE, 3);
                const sparkColors = [0xFFFF0044, 0xFF00FF00, 0xFF00FFFF, 0xFFFF00FF, 0xFFFFFF00, 0xFFFF8800, 0xFFE0FFFF];
                const { x: wx, y: wy } = this.gridToWorld(nx, ny);
                for (let k = 0; k < 20; k++) {
                    const angle = (k / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
                    const speed = 150 + Math.random() * 250;
                    const sparkCol = sparkColors[Math.floor(Math.random() * sparkColors.length)];
                    this.spawnOrbitalParticle(wx, wy, Math.cos(angle) * speed, Math.sin(angle) * speed, MAT.FIRE, sparkCol);
                }
            } else if (nMat === MAT.NITRO) {
                this.carveExplosion(this.gridToWorld(nx, ny).x, this.gridToWorld(nx, ny).y, 36);
                this.emitGas(nx, ny, MAT.SMOKE, 3);
            } else if (nMat === MAT.THERMITE) {
                this.setMat(nx, ny, MAT.FIRE);
                this.emitGas(nx, ny, MAT.SMOKE, 2);
            } else if (nMat === MAT.ICE || nMat === MAT.SNOW) {
                this.setMat(nx, ny, MAT.WATER);
                this.emitGas(nx, ny, MAT.STEAM, sourceMat === MAT.LAVA ? 3 : 2);
            } else if (nMat === MAT.MUD) {
                // Bakes mud into brick
                this.setMat(nx, ny, Math.random() < 0.6 ? MAT.BRICK : MAT.DIRT);
                this.emitGas(nx, ny, MAT.STEAM, 1);
            } else if (nMat === MAT.COAL) {
                this.colors[nIdx] = 0xFF0055FF; // Glow orange-red smoldering
                this.emitGas(x, y, MAT.SMOKE, 1);
                if (Math.random() < 0.15) this.setMat(x, y, MAT.CO2);
            } else if (nMat === MAT.CO2 || nMat === MAT.LN2) {
                if (sourceMat === MAT.FIRE) {
                    this.setMat(x, y, MAT.SMOKE);
                    this.emitGas(x, y, MAT.SMOKE, 2);
                    return;
                } else if (sourceMat === MAT.LAVA) {
                    this.setMat(x, y, MAT.OBSIDIAN);
                    this.setMat(nx, ny, MAT.STEAM);
                    this.emitGas(nx, ny, MAT.STEAM, 3);
                    return;
                }
            } else if (nMat === MAT.EMP) {
                this.triggerEMP(nx, ny);
            }
        }
    }

    checkChemicalReactions(x, y, mat) {
        if (mat !== MAT.ACID && Math.random() > 0.35) return false;
        if (mat === MAT.ACID && Math.random() > 0.65) return false;
        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [ox, oy] of offsets) {
            const nx = x + ox;
            const ny = y + oy;
            if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) continue;
            const nIdx = ny * this.width + nx;
            const nMat = this.data[nIdx];

            // 1. LAVA & EXTREME GEOTHERMAL REACTIONS
            if (mat === MAT.LAVA) {
                if (nMat === MAT.WATER) {
                    // Magma + Water -> Obsidian + Steam plume
                    this.setMat(x, y, MAT.OBSIDIAN);
                    this.setMat(nx, ny, MAT.STEAM);
                    this.emitGas(nx, ny, MAT.STEAM, 3);
                    return true;
                } else if (nMat === MAT.ICE || nMat === MAT.SNOW) {
                    // Flash-boiling phreatomagmatic steam detonation!
                    this.setMat(x, y, MAT.OBSIDIAN);
                    this.setMat(nx, ny, MAT.STEAM);
                    this.emitGas(nx, ny, MAT.STEAM, 4);
                    if (Math.random() < 0.35) {
                        this.carveExplosion(this.gridToWorld(x, y).x, this.gridToWorld(x, y).y, 20, { isMagma: false, pushPower: 1.5 });
                    }
                    return true;
                } else if (nMat === MAT.SAND) {
                    // Silicate melting: 1/4 volume conversion into magma, remaining 3/4 vaporized or vitrified into stable glass
                    if (Math.random() < 0.25) {
                        this.setMat(nx, ny, MAT.LAVA);
                    } else if (Math.random() < 0.50) {
                        this.setMat(nx, ny, MAT.GLASS);
                    } else {
                        this.setMat(nx, ny, MAT.AIR);
                        this.emitGas(nx, ny, MAT.SMOKE, 1);
                    }
                    return true;
                } else if (nMat === MAT.GLASS) {
                    // Stable glass refractory boundary
                    if (Math.random() < 0.05) {
                        this.setMat(nx, ny, MAT.OBSIDIAN);
                    }
                    return true;
                } else if (nMat === MAT.MERC) {
                    // Heavy metal boiling -> Plasma flare
                    this.setMat(nx, ny, MAT.PLSM);
                    this.emitGas(nx, ny, MAT.SMOKE, 2);
                    return true;
                } else if (nMat === MAT.GRAVITITE) {
                    // Pumice ejection
                    this.setMat(x, y, MAT.OBSIDIAN);
                    this.setMat(nx, ny, MAT.GRAVITITE);
                    return true;
                } else if (nMat === MAT.COAL) {
                    // High-pressure carbon metamorphosis into Diamond crystal
                    if (Math.random() < 0.06) {
                        this.setMat(nx, ny, MAT.DIAMOND);
                    } else {
                        this.setMat(nx, ny, MAT.FIRE);
                        this.emitGas(nx, ny, MAT.CO2, 2);
                    }
                    return true;
                } else if (nMat === MAT.DIRT || nMat === MAT.STONE || nMat === MAT.BRICK || nMat === MAT.CONCRETE) {
                    if (Math.random() < 0.03) {
                        // 1/4 volume conversion into magma, 3/4 vaporized/cooled
                        if (Math.random() < 0.25) {
                            this.setMat(nx, ny, MAT.LAVA);
                        } else {
                            this.setMat(nx, ny, MAT.AIR);
                            this.emitGas(nx, ny, MAT.SMOKE, 1);
                        }
                        // Lava cools into obsidian when absorbing dense rock
                        if (Math.random() < 0.30) {
                            this.setMat(x, y, MAT.OBSIDIAN);
                        }
                        return true;
                    }
                } else if (nMat === MAT.WOOD || nMat === MAT.FLORA) {
                    this.setMat(nx, ny, MAT.FIRE);
                    this.emitGas(nx, ny, MAT.SMOKE, 2);
                    if (Math.random() < 0.3) this.setMat(x, y, MAT.COAL);
                    return true;
                } else if (nMat === MAT.OIL || nMat === MAT.METN || nMat === MAT.HYGN) {
                    this.setMat(nx, ny, MAT.FIRE);
                    this.emitGas(nx, ny, MAT.SMOKE, 3);
                    return true;
                } else if (nMat === MAT.LN2) {
                    // Cryo-quench into Diamond or Obsidian + massive cold steam
                    this.setMat(x, y, Math.random() < 0.08 ? MAT.DIAMOND : MAT.OBSIDIAN);
                    this.setMat(nx, ny, MAT.STEAM);
                    this.emitGas(nx, ny, MAT.STEAM, 4);
                    return true;
                } else if (nMat === MAT.GEL) {
                    // Thermal vulcanization into Obsidian
                    this.setMat(nx, ny, MAT.OBSIDIAN);
                    this.emitGas(nx, ny, MAT.SMOKE, 1);
                    return true;
                } else if (nMat === MAT.SALT) {
                    this.setMat(nx, ny, MAT.GLASS);
                    return true;
                }
            }

            // 2. CORROSIVE ACID & RAPID CHEMICAL DISSOLUTION
            if (mat === MAT.ACID) {
                // Corrosive action: aggressive solvent that rapidly consumes geological matter, minerals, organics, and ores
                if (nMat !== MAT.AIR && nMat !== MAT.ACID && nMat !== MAT.INSL && nMat !== MAT.VOID && nMat !== MAT.BHOL && nMat !== MAT.WHOL) {
                    if (nMat === MAT.GUNPOWDER || nMat === MAT.C4) {
                        this.setMat(nx, ny, MAT.AIR);
                        this.carveExplosion(this.gridToWorld(nx, ny).x, this.gridToWorld(nx, ny).y, 30);
                        this.setMat(x, y, MAT.AIR);
                        return true;
                    } else if (nMat === MAT.URAN) {
                        this.setMat(nx, ny, MAT.PLSM);
                        this.setMat(x, y, MAT.AIR);
                        this.emitGas(nx, ny, MAT.NEUT, 2);
                        return true;
                    } else {
                        // Dissolves bedrock, obsidian, stone, dirt, metal, sand, coal, gravitite, ice, flora, etc.
                        this.setMat(nx, ny, MAT.AIR);
                        const fumes = Math.random() < 0.45 ? MAT.HYGN : (Math.random() < 0.75 ? MAT.STEAM : MAT.SMOKE);
                        this.emitGas(nx, ny, fumes, 1);

                        // High chemical potency: 85% chance acid particle survives and drills deeper into the crust
                        if (Math.random() < 0.15) {
                            this.setMat(x, y, MAT.AIR);
                        }
                        return true;
                    }
                }

                // Slow evaporation for completely stagnant idle pools so they don't block core forever
                if (Math.random() < 0.003) {
                    this.setMat(x, y, MAT.AIR);
                    this.emitGas(x, y, MAT.SMOKE, 1);
                    return true;
                }
            }

            // 3. LIQUID NITROGEN (LN2) CRYOGENIC SUB-ZERO CHEMISTRY
            if (mat === MAT.LN2) {
                if (nMat === MAT.WATER) {
                    // Flash freeze into ice
                    this.setMat(nx, ny, MAT.ICE);
                    this.setMat(x, y, MAT.AIR);
                    this.emitGas(nx, ny, MAT.STEAM, 2);
                    return true;
                } else if (nMat === MAT.STEAM) {
                    // Condensates steam into snow
                    this.setMat(nx, ny, MAT.SNOW);
                    return true;
                } else if (nMat === MAT.LAVA) {
                    // Cryo-quench magma into diamond or obsidian
                    this.setMat(nx, ny, Math.random() < 0.08 ? MAT.DIAMOND : MAT.OBSIDIAN);
                    this.setMat(x, y, MAT.STEAM);
                    this.emitGas(x, y, MAT.STEAM, 4);
                    return true;
                } else if (nMat === MAT.FIRE || nMat === MAT.PLSM) {
                    // Thermal quench
                    this.setMat(nx, ny, MAT.AIR);
                    this.setMat(x, y, MAT.SMOKE);
                    this.emitGas(x, y, MAT.SMOKE, 3);
                    return true;
                } else if (nMat === MAT.MUD) {
                    this.setMat(nx, ny, MAT.DIRT);
                    this.setMat(x, y, MAT.ICE);
                    return true;
                } else if (nMat === MAT.METN) {
                    // Condenses methane gas into petroleum oil!
                    this.setMat(nx, ny, MAT.OIL);
                    this.setMat(x, y, MAT.AIR);
                    return true;
                } else if (nMat === MAT.HYGN) {
                    // Liquefies hydrogen gas into viscous gel
                    this.setMat(nx, ny, MAT.GEL);
                    this.setMat(x, y, MAT.AIR);
                    return true;
                } else if (nMat === MAT.MERC) {
                    // Freezes liquid mercury into conductive metal!
                    this.setMat(nx, ny, MAT.METAL);
                    return true;
                } else if (nMat === MAT.GEL) {
                    // Freezes gel into brittle glass
                    this.setMat(nx, ny, MAT.GLASS);
                    return true;
                } else if (nMat === MAT.FLORA || nMat === MAT.WOOD) {
                    // Flash-freezes plant matter into shatterable glass
                    this.setMat(nx, ny, MAT.GLASS);
                    return true;
                } else if (nMat === MAT.ACID) {
                    // Freezes acid into solid salt crystals
                    this.setMat(nx, ny, MAT.SALT);
                    this.setMat(x, y, MAT.AIR);
                    return true;
                } else if (nMat === MAT.CO2) {
                    // Solidifies CO2 into dry ice
                    this.setMat(nx, ny, MAT.ICE);
                    this.setMat(x, y, MAT.AIR);
                    return true;
                }
            }

            // 4. THERMITE INCENDIARY REACTIONS
            if (mat === MAT.THERMITE && (nMat === MAT.FIRE || nMat === MAT.LAVA || nMat === MAT.PLSM || nMat === MAT.SPRK || nMat === MAT.ELEC)) {
                this.setMat(x, y, MAT.LAVA);
                this.emitGas(x, y, MAT.SMOKE, 2);
                for (const [tox, toy] of offsets) {
                    const tx = x + tox;
                    const ty = y + toy;
                    if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
                        const tMat = this.data[ty * this.width + tx];
                        if (tMat === MAT.STONE || tMat === MAT.METAL || tMat === MAT.BRICK || tMat === MAT.OBSIDIAN || tMat === MAT.CONCRETE || tMat === MAT.DIRT) {
                            this.setMat(tx, ty, MAT.LAVA);
                        } else if (tMat === MAT.WATER || tMat === MAT.ICE) {
                            // Violent steam explosion when thermite hits water
                            this.setMat(tx, ty, MAT.STEAM);
                            this.emitGas(tx, ty, MAT.STEAM, 4);
                            this.carveExplosion(this.gridToWorld(tx, ty).x, this.gridToWorld(tx, ty).y, 22, { pushPower: 1.8 });
                        }
                    }
                }
                return true;
            }

            // 5. HYDRAULIC CONCRETE CURING
            if (mat === MAT.CONCRETE && nMat === MAT.WATER) {
                this.setMat(x, y, MAT.STONE);
                return true;
            }

            // 6. DIRT & MUD HYDROLOGY & KILN BAKING
            if (mat === MAT.DIRT && nMat === MAT.WATER && Math.random() < 0.35) {
                this.setMat(x, y, MAT.MUD);
                this.setMat(nx, ny, MAT.AIR);
                return true;
            }
            if (mat === MAT.MUD && (nMat === MAT.FIRE || nMat === MAT.LAVA || nMat === MAT.PLSM || nMat === MAT.ELEC)) {
                this.setMat(x, y, Math.random() < 0.65 ? MAT.BRICK : MAT.STONE);
                this.emitGas(x, y, MAT.STEAM, 2);
                return true;
            }

            // 7. SALT DEPRESSION & REACTIONS
            if (mat === MAT.SALT) {
                if (nMat === MAT.ICE || nMat === MAT.SNOW) {
                    this.setMat(nx, ny, MAT.WATER); // Freezing point depression
                    this.setMat(x, y, MAT.AIR);
                    return true;
                } else if (nMat === MAT.ACID) {
                    this.setMat(nx, ny, MAT.CO2);
                    this.setMat(x, y, MAT.WATER);
                    this.emitGas(nx, ny, MAT.CO2, 2);
                    return true;
                } else if (nMat === MAT.LAVA) {
                    this.setMat(x, y, MAT.GLASS);
                    return true;
                }
            }

            // 8. SOAP DETERGENT & SURFACTANT EMULSIFICATION
            if (mat === MAT.SOAP) {
                if (nMat === MAT.OIL) {
                    this.setMat(nx, ny, MAT.WATER); // Dissolves petroleum slick
                    this.setMat(x, y, MAT.WATER);
                    return true;
                } else if (nMat === MAT.ACID) {
                    this.setMat(nx, ny, MAT.WATER); // Neutralizes acid
                    this.setMat(x, y, MAT.SALT);
                    return true;
                } else if (nMat === MAT.WATER && Math.random() < 0.25) {
                    this.setMat(x, y, MAT.GEL); // Suds foaming
                    return true;
                }
            }

            // 9. ELASTIC GEL SHOCK ABSORBER
            if (mat === MAT.GEL) {
                if (nMat === MAT.FIRE || nMat === MAT.LAVA || nMat === MAT.PLSM) {
                    this.setMat(x, y, MAT.OBSIDIAN); // Thermal vulcanization
                    this.emitGas(x, y, MAT.SMOKE, 1);
                    return true;
                } else if (nMat === MAT.ACID) {
                    this.setMat(x, y, MAT.MUD);
                    this.setMat(nx, ny, MAT.WATER);
                    return true;
                } else if (nMat === MAT.SOAP) {
                    this.setMat(x, y, MAT.WATER);
                    return true;
                }
            }

            // 10. FLORA BOTANY, PHOTOSYNTHESIS & WITHERING
            if (mat === MAT.FLORA) {
                if (nMat === MAT.WATER && Math.random() < 0.22) {
                    // Flora drinks water to grow outward and releases oxygen
                    this.setMat(nx, ny, MAT.FLORA);
                    if (Math.random() < 0.45) {
                        const upX = x + Math.sign(x - this.cx);
                        const upY = y + Math.sign(y - this.cy);
                        if (upX >= 0 && upX < this.width && upY >= 0 && upY < this.height && this.data[upY * this.width + upX] === MAT.AIR) {
                            this.setMat(upX, upY, MAT.OXYG);
                        }
                    }
                    return true;
                } else if (nMat === MAT.CO2 && Math.random() < 0.3) {
                    // Carbon capture: absorbs CO2 and converts to Oxygen
                    this.setMat(nx, ny, MAT.OXYG);
                    return true;
                } else if (nMat === MAT.MUD && Math.random() < 0.15) {
                    // Root growth into mud converts it to rich dirt
                    this.setMat(nx, ny, MAT.DIRT);
                    this.setMat(x, y, MAT.FLORA);
                    return true;
                } else if (nMat === MAT.SALT) {
                    // Osmotic withering
                    this.setMat(x, y, MAT.SAND);
                    return true;
                }
            }

            // 11. OXYHYDROGEN & METHANE GAS DETONATIONS
            if (mat === MAT.HYGN && nMat === MAT.OXYG) {
                for (const [tox, toy] of offsets) {
                    const tx = x + tox;
                    const ty = y + toy;
                    if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
                        const tMat = this.data[ty * this.width + tx];
                        if (tMat === MAT.FIRE || tMat === MAT.LAVA || tMat === MAT.PLSM || tMat === MAT.SPRK || tMat === MAT.ELEC) {
                            this.carveExplosion(this.gridToWorld(x, y).x, this.gridToWorld(x, y).y, 52, { pushPower: 2.8 });
                            this.setMat(x, y, MAT.WATER);
                            return true;
                        }
                    }
                }
            }

            if (mat === MAT.METN && nMat === MAT.OXYG) {
                for (const [tox, toy] of offsets) {
                    const tx = x + tox;
                    const ty = y + toy;
                    if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
                        const tMat = this.data[ty * this.width + tx];
                        if (tMat === MAT.FIRE || tMat === MAT.LAVA || tMat === MAT.PLSM || tMat === MAT.SPRK || tMat === MAT.ELEC) {
                            this.carveExplosion(this.gridToWorld(x, y).x, this.gridToWorld(x, y).y, 44, { pushPower: 2.3 });
                            this.setMat(x, y, MAT.CO2);
                            this.setMat(nx, ny, MAT.STEAM);
                            return true;
                        }
                    }
                }
            }

            // 12. STELLAR FUSION (Hydrogen + Plasma -> Star core burst)
            if (mat === MAT.HYGN && nMat === MAT.PLSM) {
                this.setMat(x, y, MAT.PLSM);
                if (Math.random() < 0.4) this.setMat(nx, ny, MAT.NEUT);
                else this.setMat(nx, ny, MAT.PHOT);
                return true;
            }

            // 13. WATER ELECTROLYSIS
            if (mat === MAT.WATER && (nMat === MAT.SPRK || nMat === MAT.ELEC)) {
                if (Math.random() < 0.35) {
                    this.setMat(x, y, Math.random() < 0.66 ? MAT.HYGN : MAT.OXYG);
                    return true;
                }
            }

            // 14. HIGH-VOLTAGE FULGURITE (Sand + Spark/Lightning -> Glass)
            if (mat === MAT.SAND && (nMat === MAT.SPRK || nMat === MAT.ELEC)) {
                this.setMat(x, y, MAT.GLASS);
                return true;
            }

            // 15. ANTIGRAVITY PULSE (Gravitite + Spark/Lightning/Plasma/Tesla)
            if (mat === MAT.GRAVITITE && (nMat === MAT.SPRK || nMat === MAT.ELEC || nMat === MAT.PLSM || nMat === MAT.TESL)) {
                const { x: wx, y: wy } = this.gridToWorld(x, y);
                const gAngle = Math.atan2(y - this.cy, x - this.cx) + (Math.random() - 0.5) * 0.4;
                this.spawnOrbitalParticle(wx, wy, Math.cos(gAngle) * 320, Math.sin(gAngle) * 320, MAT.GRAVITITE);
                this.setMat(x, y, MAT.AIR);
                return true;
            }

            // 16. PYROTECHNIC FIREWORKS DISCHARGE (FWRK + Heat/Spark/Laser)
            if (mat === MAT.FWRK && (nMat === MAT.FIRE || nMat === MAT.SPRK || nMat === MAT.ELEC || nMat === MAT.PLSM || nMat === MAT.PHOT || nMat === MAT.LAVA)) {
                this.setMat(x, y, MAT.AIR);
                const sparkColors = [0xFFFF0044, 0xFF00FF00, 0xFF00FFFF, 0xFFFF00FF, 0xFFFFFF00, 0xFFFF8800, 0xFFE0FFFF];
                const { x: wx, y: wy } = this.gridToWorld(nx, ny);
                for (let k = 0; k < 20; k++) {
                    const angle = (k / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
                    const speed = 150 + Math.random() * 250;
                    const sparkCol = sparkColors[Math.floor(Math.random() * sparkColors.length)];
                    this.spawnOrbitalParticle(wx, wy, Math.cos(angle) * speed, Math.sin(angle) * speed, MAT.FIRE, sparkCol);
                }
                return true;
            }

            // 17. URANIUM CORIUM MELTDOWN & RADIATION EXCITATION
            if (mat === MAT.URAN && (nMat === MAT.FIRE || nMat === MAT.LAVA || nMat === MAT.PLSM)) {
                if (Math.random() < 0.12) {
                    this.setMat(x, y, MAT.PLSM);
                    const rAngle = Math.random() * Math.PI * 2;
                    const rx = Math.round(x + Math.cos(rAngle) * 2);
                    const ry = Math.round(y + Math.sin(rAngle) * 2);
                    if (rx >= 0 && rx < this.width && ry >= 0 && ry < this.height && this.data[ry * this.width + rx] === MAT.AIR) {
                        this.setMat(rx, ry, MAT.NEUT);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    getSurfaceRadiusAtAngle(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const maxR = this.cx - 2;

        for (let r = maxR; r >= 4; r--) {
            const gx = Math.round(this.cx + cos * r);
            const gy = Math.round(this.cy + sin * r);
            if (gx >= 0 && gx < this.width && gy >= 0 && gy < this.height) {
                const mat = this.data[gy * this.width + gx];
                if (!isGasOrEnergy(mat)) {
                    const worldR = r * this.scale;
                    let normAngle = angle % (Math.PI * 2);
                    if (normAngle < 0) normAngle += Math.PI * 2;
                    const degIdx = Math.floor((normAngle / (Math.PI * 2)) * 360) % 360;
                    this.surfaceRadiusCache[degIdx] = worldR;
                    return worldR;
                }
            }
        }

        return 30;
    }

    /**
     * Scan the planetary surface to lock onto the highest elevation peaks/crust layers.
     * Ensures weapons peel the planet layer-by-layer from the outside inward.
     */
    getHighestSurfaceTarget(sampleCount = 14) {
        let bestAngle = Math.random() * Math.PI * 2;
        let bestR = -Infinity;

        // Sample surface directions to find the highest terrain peak
        for (let i = 0; i < sampleCount; i++) {
            const sampleAngle = Math.random() * Math.PI * 2;
            const r = this.getSurfaceRadiusAtAngle(sampleAngle);
            if (r > bestR) {
                bestR = r;
                bestAngle = sampleAngle;
            }
        }

        // Add subtle radial jitter for natural weapon spread across the high ground
        bestAngle += (Math.random() - 0.5) * 0.08;
        bestR = this.getSurfaceRadiusAtAngle(bestAngle);

        return {
            angle: bestAngle,
            radius: bestR,
            x: Math.cos(bestAngle) * bestR,
            y: Math.sin(bestAngle) * bestR
        };
    }

    updateSurfaceCache() {
        const maxR = this.cx - 2;
        for (let deg = 0; deg < 360; deg++) {
            const angle = (deg / 360) * (Math.PI * 2);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            let found = false;

            for (let r = maxR; r >= 4; r--) {
                const gx = Math.round(this.cx + cos * r);
                const gy = Math.round(this.cy + sin * r);
                const mat = this.getMat(gx, gy);
                if (!isGasOrEnergy(mat)) {
                    this.surfaceRadiusCache[deg] = r * this.scale;
                    found = true;
                    break;
                }
            }
            if (!found) this.surfaceRadiusCache[deg] = 30;
        }
    }

    renderToCanvas() {
        this.ctx.putImageData(this.imgData, 0, 0);
        this.isDirty = false;
    }

    update(dt) {
        this.simTickAccumulator += dt;
        const tickRate = 0.016;

        // Perform at most 1 simulation step per animation frame to prevent frame drops
        if (this.simTickAccumulator >= tickRate) {
            this.stepSimulation();
            this.simTickAccumulator = 0;
        }

        this.updateOrbitalParticles(dt);
    }

    draw(ctx) {
        if (this.isDirty) {
            this.renderToCanvas();
        }

        ctx.save();
        ctx.drawImage(
            this.canvas,
            -this.width * this.scale * 0.5,
            -this.height * this.scale * 0.5,
            this.width * this.scale,
            this.height * this.scale
        );

        for (let i = 0; i < this.orbitalParticles.length; i++) {
            const p = this.orbitalParticles[i];
            ctx.fillStyle = p.mat === MAT.LAVA ? '#ff4400' : (p.mat === MAT.WATER ? '#00bfff' : (p.mat === MAT.GRAVITITE ? '#fa50da' : '#eedd88'));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
