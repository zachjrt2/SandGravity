// Incremental & Idle Destruction Engine for Gravity Wars: Planet Breaker
import { MAT } from './sand_engine.js';
import { sound } from './audio.js';

export const HARDNESS_TIERS = {
    1: {
        id: 1,
        name: 'Sedimentary Regolith',
        classification: 'Tier 1: Soft Crust & Regolith',
        badgeColor: '#94a3b8',
        hardnessRating: 1.0,
        hardnessLabel: 'Mohs 2.0 (Soft Sandstone)',
        radius: 525,
        sizeLabel: 'Compact Moon (Ø 1,050)',
        desc: 'Brittle sedimentary sandstone, loose regolith, salt veins, and quartz crystal shale. Compact starting moon with varied mineral strata.',
        stardustMultiplier: 1.0,
        coreReward: 1,
        coreMaterial: MAT.BEDROCK,
        primaryMats: [MAT.STONE, MAT.BEDROCK, MAT.SAND, MAT.SALT, MAT.GLASS, MAT.BRICK],
        unlockCost: 0
    },
    2: {
        id: 2,
        name: 'Basaltic Oceanic Crust',
        classification: 'Tier 2: Dense Basalt & Ocean Bedrock',
        badgeColor: '#38bdf8',
        hardnessRating: 2.5,
        hardnessLabel: 'Mohs 5.5 (Igneous Basalt)',
        radius: 900,
        sizeLabel: 'Terrestrial World (Ø 1,800)',
        desc: 'Solid oceanic basalt, granite bedrock, concrete strata, iron veins, and deep water oceans with lush vegetative continents.',
        stardustMultiplier: 3.5,
        coreReward: 2,
        coreMaterial: MAT.OBSIDIAN,
        primaryMats: [MAT.WATER, MAT.DIRT, MAT.FLORA, MAT.STONE, MAT.OBSIDIAN, MAT.CONCRETE, MAT.MUD, MAT.METAL],
        unlockCost: 3500
    },
    3: {
        id: 3,
        name: 'Ferrous Mineral Strata',
        classification: 'Tier 3: Reinforced Iron & Hydrocarbon',
        badgeColor: '#c084fc',
        hardnessRating: 6.5,
        hardnessLabel: 'Mohs 8.0 (Hardened Iron Ore)',
        radius: 1350,
        sizeLabel: 'Super-Earth (Ø 2,700)',
        desc: 'Dense structural titanium seams, ceramic insulator plates, diamond clusters, and rich carbonaceous coal strata.',
        stardustMultiplier: 12.0,
        coreReward: 5,
        coreMaterial: MAT.COAL,
        primaryMats: [MAT.METAL, MAT.COAL, MAT.DIAMOND, MAT.INSL, MAT.STONE, MAT.OIL, MAT.BRICK],
        unlockCost: 45000
    },
    4: {
        id: 4,
        name: 'Superheated Magma Caldera',
        classification: 'Tier 4: Magma Mantle & Obsidian Plate',
        badgeColor: '#ff5500',
        hardnessRating: 18.0,
        hardnessLabel: 'Mohs 12.0 (Compressed Obsidian)',
        radius: 1875,
        sizeLabel: 'Mega-Caldera (Ø 3,750)',
        desc: 'Super-dense obsidian plates, refractory masonry, thermal insulator shielding, and diamond foundations intersected by magma fissures.',
        stardustMultiplier: 45.0,
        coreReward: 12,
        coreMaterial: MAT.LAVA,
        primaryMats: [MAT.OBSIDIAN, MAT.INSL, MAT.BRICK, MAT.DIAMOND, MAT.METAL, MAT.LAVA, MAT.THERMITE],
        unlockCost: 350000
    },
    5: {
        id: 5,
        name: 'Adamantine Isotope Mantle',
        classification: 'Tier 5: Fissile Uranium & Adamantine Armor',
        badgeColor: '#22c55e',
        hardnessRating: 60.0,
        hardnessLabel: 'Mohs 20.0 (Adamantine Lattice)',
        radius: 2400,
        sizeLabel: 'Colossus World (Ø 4,800)',
        desc: 'Shock-hardened adamantine alloy, diamond vaults, dense composite concrete, and ceramic insulator armor housing fissile radioactive ores.',
        stardustMultiplier: 180.0,
        coreReward: 25,
        coreMaterial: MAT.URAN,
        primaryMats: [MAT.METAL, MAT.DIAMOND, MAT.CONCRETE, MAT.INSL, MAT.OBSIDIAN, MAT.URAN, MAT.NITRO],
        unlockCost: 3000000
    },
    6: {
        id: 6,
        name: 'Quantum Singularity Lattice',
        classification: 'Tier 6: Degenerate Matter & Event Horizon',
        badgeColor: '#d946ef',
        hardnessRating: 200.0,
        hardnessLabel: 'Mohs 50.0 (Neutronium Singularity)',
        radius: 2880,
        sizeLabel: 'Titanic Singularity (Ø 5,760)',
        desc: 'Singularity event horizon encircled by crystalline diamond matrices, void obsidian, quantum ceramic insulators, titanium ribs, and plasma veins.',
        stardustMultiplier: 800.0,
        coreReward: 60,
        coreMaterial: MAT.VOID,
        primaryMats: [MAT.DIAMOND, MAT.OBSIDIAN, MAT.INSL, MAT.BEDROCK, MAT.METAL, MAT.VOID, MAT.PLSM, MAT.GRAVITITE],
        unlockCost: 25000000
    }
};

// Backwards compatibility alias
export const VOLATILITY_TIERS = HARDNESS_TIERS;

export class IncrementalEngine {
    constructor(game) {
        this.game = game;

        // Currencies
        this.stardust = 0;
        this.totalStardustEarned = 0;
        this.omegaCores = 0;
        this.totalOmegaCoresEarned = 0;
        this.planetsDestroyed = 0;

        // Active Planet State
        this.currentTier = 1;
        this.maxUnlockedTier = 1;
        this.coreMaxVoxels = 1000;
        this.coreRemainingVoxels = 1000;
        this.coreHealthPct = 1.0;
        this.isSupernovaActive = false;
        this.supernovaTimer = 0;

        // Rebalanced Long-Term Progression Upgrades (Purchased with Stardust)
        this.upgrades = {
            // 1. Precision Mining Laser (Aggressive Exponential Scaling)
            clickPower: {
                id: 'clickPower',
                name: 'Kinetic Mining Laser',
                icon: '⛏️',
                desc: 'Precision manual laser drill. Modestly increases drill penetration and grain yield against tough crusts.',
                level: 0,
                baseCost: 150,
                costMult: 3.80
            },
            // 2. Passive Asteroid Swarms
            asteroidTugs: {
                id: 'asteroidTugs',
                name: 'Asteroid Tug Swarm',
                icon: '☄️',
                desc: 'Pulls fiery rogue meteors from deep space to bombard the planet.',
                level: 0,
                baseCost: 250,
                costMult: 2.20,
                cooldown: 4.5,
                timer: 1.0
            },
            asteroidSize: {
                id: 'asteroidSize',
                name: 'Meteor Mass Driver',
                icon: '💥',
                desc: 'Increases meteor size, atmospheric burn trail, and impact crater radius.',
                level: 0,
                baseCost: 650,
                costMult: 2.40
            },
            // 3. Orbital Thermal Laser (Mid-Game Focused Cutting Beam)
            thermalLaser: {
                id: 'thermalLaser',
                name: 'Orbital Thermal Lance',
                icon: '⚡',
                desc: 'Pulsed surgical high-energy laser beam sweeping and vaporizing the crust.',
                level: 0,
                baseCost: 2800,
                costMult: 2.60,
                cooldown: 5.5,
                timer: 2.0
            },
            // 4. Acid Cloud Seeders (Heavy Chemical Erosion Fleet)
            acidDrones: {
                id: 'acidDrones',
                name: 'Acid Rain Seeder Fleet',
                icon: '🧪',
                desc: 'High-tech orbital drones dropping sizzling fluorescent acid rain clouds.',
                level: 0,
                baseCost: 14000,
                costMult: 2.80,
                cooldown: 6.0,
                timer: 2.5
            },
            // 5. Orbital Kinetic Railgun (Late Game Heavy Penetrator)
            kineticRods: {
                id: 'kineticRods',
                name: 'Kinetic Rods from God',
                icon: '🚀',
                desc: 'Fires hypersonic tungsten penetrators with 4-stage deep mantle borehole boring.',
                level: 0,
                baseCost: 85000,
                costMult: 3.05,
                cooldown: 4.2,
                timer: 2.5
            },
            // 6. Thermonuclear Bombardment
            nuclearBomber: {
                id: 'nuclearBomber',
                name: 'Thermonuclear Satellites',
                icon: '☢️',
                desc: 'Deploys orbital bombers dropping fusion warheads with double-ring fireballs.',
                level: 0,
                baseCost: 450000,
                costMult: 3.20,
                cooldown: 9.5,
                timer: 5.0
            }
        };

        // Permanent Meta-Progression Perks (Purchased with Omega-Cores)
        this.metaPerks = {
            stardustAlchemy: {
                id: 'stardustAlchemy',
                name: 'Stardust Alchemy',
                icon: '✨',
                desc: '+35% Stardust yield per particle destroyed across all runs.',
                level: 0,
                baseCost: 2,
                costMult: 2.0,
                bonusPerLevel: 0.35
            },
            orbitalAcceleration: {
                id: 'orbitalAcceleration',
                name: 'Orbital Acceleration',
                icon: '🛰️',
                desc: '-12% cooldown for all passive orbital weapons.',
                level: 0,
                baseCost: 3,
                costMult: 2.2,
                bonusPerLevel: 0.12
            },
            exoticPayloads: {
                id: 'exoticPayloads',
                name: 'Exotic Meteor Payloads',
                icon: '🔥',
                desc: '+10% chance for meteors to trigger thermite or plasma detonations.',
                level: 0,
                baseCost: 5,
                costMult: 2.5,
                bonusPerLevel: 0.10
            },
            coreHarvester: {
                id: 'coreHarvester',
                name: 'Core Harvester',
                icon: '💎',
                desc: '+1 additional Omega-Core per destroyed planet.',
                level: 0,
                baseCost: 8,
                costMult: 2.5,
                bonusPerLevel: 1
            },
            startingPermit: {
                id: 'startingPermit',
                name: 'Celestial Jump-Drive',
                icon: '🌌',
                desc: 'Start new planets with +150 bonus starting Stardust per level.',
                level: 0,
                baseCost: 4,
                costMult: 2.2,
                bonusPerLevel: 150
            }
        };

        // Active Visual Weapon Projectiles & FX Entities
        this.visualEntities = [];
        this.floatingTexts = [];

        // Load saved state if available
        this.loadGame();
    }

    // Cost calculations
    getUpgradeCost(upgradeId) {
        const up = this.upgrades[upgradeId];
        if (!up) return 0;
        return Math.floor(up.baseCost * Math.pow(up.costMult, up.level));
    }

    getMetaCost(perkId) {
        const perk = this.metaPerks[perkId];
        if (!perk) return 0;
        return Math.floor(perk.baseCost * Math.pow(perk.costMult, perk.level));
    }

    buyUpgrade(upgradeId) {
        const cost = this.getUpgradeCost(upgradeId);
        if (this.stardust >= cost) {
            this.stardust -= cost;
            this.upgrades[upgradeId].level++;
            sound.playShoot('energy');
            this.saveGame();
            return true;
        }
        return false;
    }

    buyMetaPerk(perkId) {
        const cost = this.getMetaCost(perkId);
        if (this.omegaCores >= cost) {
            this.omegaCores -= cost;
            this.metaPerks[perkId].level++;
            sound.playShoot('terraform');
            this.saveGame();
            return true;
        }
        return false;
    }

    getTierData(tier = this.currentTier) {
        return HARDNESS_TIERS[tier] || HARDNESS_TIERS[1];
    }

    unlockHardnessTier(tier) {
        const tierData = HARDNESS_TIERS[tier];
        if (!tierData) return false;
        if (this.stardust >= tierData.unlockCost && this.maxUnlockedTier === tier - 1) {
            this.stardust -= tierData.unlockCost;
            this.maxUnlockedTier = tier;
            this.currentTier = tier;
            this.spawnNewPlanet(tier);
            sound.playExplosion(1.6);
            this.saveGame();
            return true;
        }
        return false;
    }

    unlockVolatilityTier(tier) {
        return this.unlockHardnessTier(tier);
    }

    setPlanetTier(tier) {
        if (tier <= this.maxUnlockedTier && HARDNESS_TIERS[tier]) {
            this.currentTier = tier;
            this.spawnNewPlanet(tier);
            this.saveGame();
        }
    }

    addStardust(amount, sourceX = null, sourceY = null) {
        if (amount <= 0) return;
        
        const tierMult = HARDNESS_TIERS[this.currentTier]?.stardustMultiplier || 1.0;
        const metaMult = 1.0 + (this.metaPerks.stardustAlchemy.level * this.metaPerks.stardustAlchemy.bonusPerLevel);
        const finalAmount = amount * tierMult * metaMult;

        this.stardust += finalAmount;
        this.totalStardustEarned += finalAmount;

        if (sourceX !== null && sourceY !== null && Math.random() < 0.2) {
            this.spawnFloatingText(`+${Math.round(finalAmount)} ✨`, sourceX, sourceY, '#00f0ff');
        }
    }

    spawnFloatingText(text, worldX, worldY, color = '#ffffff') {
        this.floatingTexts.push({
            text,
            x: worldX + (Math.random() - 0.5) * 16,
            y: worldY + (Math.random() - 0.5) * 16,
            vy: -45 - Math.random() * 25,
            color,
            alpha: 1.0,
            life: 0.95
        });
    }

    /**
     * Measure remaining central core voxels in the simulation
     */
    measureCoreHealth() {
        const engine = this.game.sandEngine;
        if (!engine) return;

        const coreR = Math.round(14 + this.currentTier * 2.5); // Core scales proportionally with planet size
        let count = 0;
        const cx = engine.cx;
        const cy = engine.cy;

        // Non-core elements (Air, Acid, Water, non-core fluids, gases, and energetic FX)
        const isNonCoreMat = (mat) => {
            return (
                mat === MAT.AIR ||
                mat === MAT.ACID ||
                mat === MAT.WATER ||
                mat === MAT.LN2 ||
                mat === MAT.SOAP ||
                mat === MAT.MERC ||
                mat === MAT.GEL ||
                mat === MAT.FIRE ||
                mat === MAT.STEAM ||
                mat === MAT.SMOKE ||
                mat === MAT.PLSM ||
                mat === MAT.SPRK ||
                mat === MAT.PHOT ||
                mat === MAT.NEUT ||
                mat === MAT.HYGN ||
                mat === MAT.CO2 ||
                mat === MAT.METN ||
                mat === MAT.OXYG ||
                mat === MAT.FWRK
            );
        };

        for (let dy = -coreR; dy <= coreR; dy++) {
            for (let dx = -coreR; dx <= coreR; dx++) {
                if (dx * dx + dy * dy <= coreR * coreR) {
                    const gx = cx + dx;
                    const gy = cy + dy;
                    if (gx >= 0 && gx < engine.width && gy >= 0 && gy < engine.height) {
                        const mat = engine.data[gy * engine.width + gx];
                        if (!isNonCoreMat(mat)) {
                            count++;
                        }
                    }
                }
            }
        }

        this.coreRemainingVoxels = count;
        if (this.coreMaxVoxels <= 0) this.coreMaxVoxels = Math.max(1, count);
        this.coreHealthPct = Math.max(0, Math.min(1.0, count / this.coreMaxVoxels));

        if (this.coreHealthPct <= 0.12 && !this.isSupernovaActive) {
            this.triggerSupernova();
        }
    }

    /**
     * Trigger Supernova Cataclysm when Core is annihilated!
     */
    triggerSupernova() {
        this.isSupernovaActive = true;
        this.supernovaTimer = 2.5;

        const tierData = HARDNESS_TIERS[this.currentTier] || HARDNESS_TIERS[1];
        const baseCores = tierData.coreReward;
        const bonusCores = this.metaPerks.coreHarvester.level * this.metaPerks.coreHarvester.bonusPerLevel;
        const earnedOmega = Math.max(1, baseCores + bonusCores);

        this.omegaCores += earnedOmega;
        this.totalOmegaCoresEarned += earnedOmega;
        this.planetsDestroyed++;

        this.game.triggerScreenShake(18, 2.0);
        sound.playExplosion(1.6);

        this.game.sandEngine.carveExplosion(0, 0, 480, { pushPower: 5.0 });
        this.spawnFloatingText(`💥 SUPERNOVA CATACLYSM! +${earnedOmega} Ω-CORES! 💎`, 0, -50, '#ff007f');

        this.saveGame();
    }

    /**
     * Spawns a procedural planet scaled according to its Geological Tier
     */
    spawnNewPlanet(tier = this.currentTier) {
        this.currentTier = tier;
        this.isSupernovaActive = false;
        this.supernovaTimer = 0;

        const engine = this.game.sandEngine;
        if (!engine) return;

        engine.reset();

        const tierData = HARDNESS_TIERS[tier] || HARDNESS_TIERS[1];
        const radius = tierData.radius || 580;
        const rCells = radius / engine.scale;

        engine.activeBounds = {
            minX: Math.max(1, engine.cx - Math.round(rCells * 2.5)),
            maxX: Math.min(engine.width - 2, engine.cx + Math.round(rCells * 2.5)),
            minY: Math.max(1, engine.cy - Math.round(rCells * 2.5)),
            maxY: Math.min(engine.height - 2, engine.cy + Math.round(rCells * 2.5))
        };

        const baseSurfaceR = rCells;
        const p1 = Math.random() * 20;
        const p2 = Math.random() * 20;

        for (let y = 0; y < engine.height; y++) {
            for (let x = 0; x < engine.width; x++) {
                const dx = x - engine.cx;
                const dy = y - engine.cy;
                const dist = Math.hypot(dx, dy);

                if (dist > rCells * 1.35) continue;
                const angle = Math.atan2(dy, dx);
                const surfaceElevation = baseSurfaceR + Math.sin(angle * 3 + p1) * (rCells * 0.08) + Math.cos(angle * 7 + p2) * (rCells * 0.04);

                if (dist <= surfaceElevation) {
                    const depth = surfaceElevation - dist;
                    const rRatio = dist / rCells;

                    if (tier === 1) {
                        // Sedimentary Regolith Moon: Bedrock core, sandstone, salt lenses, quartz glass seams, ceramic shale, regolith sand topsoil
                        if (rRatio <= 0.16) {
                            engine.setMat(x, y, MAT.BEDROCK);
                        } else if (Math.sin(angle * 8 + dist * 0.15 + p1) > 0.85) {
                            engine.setMat(x, y, MAT.GLASS); // Quartz crystal veins
                        } else if (Math.sin(angle * 5 - dist * 0.12 + p2) > 0.82) {
                            engine.setMat(x, y, MAT.SALT); // Halite evaporite bands
                        } else if (rRatio <= 0.45) {
                            engine.setMat(x, y, Math.random() < 0.35 ? MAT.BEDROCK : MAT.STONE);
                        } else if (rRatio <= 0.75) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.50 ? MAT.STONE : (roll < 0.75 ? MAT.BRICK : MAT.DIRT));
                        } else if (depth <= 5) {
                            engine.setMat(x, y, Math.random() < 0.75 ? MAT.SAND : MAT.DIRT);
                        } else {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.45 ? MAT.STONE : (roll < 0.70 ? MAT.CONCRETE : MAT.BRICK));
                        }
                    } else if (tier === 2) {
                        // Basaltic Oceanic Crust: Bedrock & Obsidian core, granite/concrete, metal ore seams, clay mud, sand beaches
                        if (rRatio <= 0.16) {
                            engine.setMat(x, y, MAT.OBSIDIAN);
                        } else if (Math.sin(angle * 9 + dist * 0.10 + p1) > 0.86) {
                            engine.setMat(x, y, MAT.METAL); // Iron & copper ore veins
                        } else if (Math.sin(angle * 6 - dist * 0.14 + p2) > 0.88) {
                            engine.setMat(x, y, MAT.CONCRETE); // Granite massifs
                        } else if (rRatio <= 0.45) {
                            engine.setMat(x, y, Math.random() < 0.40 ? MAT.OBSIDIAN : MAT.STONE);
                        } else if (rRatio <= 0.75) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.50 ? MAT.STONE : (roll < 0.75 ? MAT.CONCRETE : MAT.BRICK));
                        } else if (depth <= 4) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.60 ? MAT.DIRT : (roll < 0.85 ? MAT.SAND : MAT.MUD));
                        } else {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.45 ? MAT.STONE : (roll < 0.75 ? MAT.MUD : MAT.CONCRETE));
                        }
                    } else if (tier === 3) {
                        // Ferrous Mineral Strata: Coal/Diamond core, titanium alloy seams, ceramic insulator plates, graphite, brick
                        if (rRatio <= 0.16) {
                            engine.setMat(x, y, MAT.DIAMOND);
                        } else if (Math.sin(angle * 10 + dist * 0.08 + p1) > 0.82) {
                            engine.setMat(x, y, MAT.METAL); // Heavy structural titanium ore
                        } else if (Math.sin(angle * 7 - dist * 0.12 + p2) > 0.86) {
                            engine.setMat(x, y, MAT.INSL); // Dielectric ceramic insulator plates
                        } else if (Math.sin(angle * 14 + dist * 0.20 + p1) > 0.88) {
                            engine.setMat(x, y, MAT.SALT); // Salt domes
                        } else if (rRatio <= 0.45) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.35 ? MAT.OIL : (roll < 0.65 ? MAT.COAL : MAT.DIAMOND));
                        } else if (rRatio <= 0.75) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.40 ? MAT.METAL : (roll < 0.70 ? MAT.STONE : MAT.BRICK));
                        } else if (depth <= 5) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.50 ? MAT.COAL : (roll < 0.75 ? MAT.SAND : MAT.BRICK));
                        } else {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.45 ? MAT.STONE : (roll < 0.70 ? MAT.CONCRETE : MAT.COAL));
                        }
                    } else if (tier === 4) {
                        // Superheated Magma Caldera: Diamond/Bedrock core, Obsidian armor, refractory Brick, thermal Insulator, Metal, Lava channels
                        if (rRatio <= 0.15) {
                            engine.setMat(x, y, MAT.BEDROCK);
                        } else if (Math.sin(angle * 8 + dist * 0.08 + p1) > 0.85) {
                            engine.setMat(x, y, MAT.LAVA); // Magma rivers
                        } else if (Math.sin(angle * 11 - dist * 0.11 + p2) > 0.86) {
                            engine.setMat(x, y, MAT.INSL); // Thermal insulation shielding
                        } else if (Math.sin(angle * 6 + dist * 0.14 + p2) > 0.88) {
                            engine.setMat(x, y, MAT.METAL); // Heavy heat-resistant alloy
                        } else if (rRatio <= 0.55) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.45 ? MAT.OBSIDIAN : (roll < 0.75 ? MAT.DIAMOND : MAT.THERMITE));
                        } else if (rRatio <= 0.80) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.45 ? MAT.BRICK : (roll < 0.75 ? MAT.OBSIDIAN : MAT.CONCRETE));
                        } else {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.50 ? MAT.OBSIDIAN : (roll < 0.75 ? MAT.BRICK : MAT.GLASS));
                        }
                    } else if (tier === 5) {
                        // Adamantine Isotope Mantle: Diamond core, Adamantine metal alloy, Concrete bunkers, Insulator armor, Obsidian, Uran veins
                        if (rRatio <= 0.15) {
                            engine.setMat(x, y, MAT.DIAMOND);
                        } else if (Math.sin(angle * 10 + dist * 0.10 + p2) > 0.84) {
                            engine.setMat(x, y, MAT.URAN); // Fissile uranium seams
                        } else if (Math.sin(angle * 7 - dist * 0.09 + p1) > 0.86) {
                            engine.setMat(x, y, MAT.INSL); // Quantum insulator plating
                        } else if (Math.sin(angle * 13 + dist * 0.15 + p1) > 0.88) {
                            engine.setMat(x, y, MAT.CONCRETE); // Hardened bunker composite
                        } else if (rRatio <= 0.50) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.45 ? MAT.METAL : (roll < 0.75 ? MAT.DIAMOND : MAT.STONE));
                        } else if (rRatio <= 0.80) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.40 ? MAT.CONCRETE : (roll < 0.70 ? MAT.OBSIDIAN : MAT.NITRO));
                        } else {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.45 ? MAT.METAL : (roll < 0.75 ? MAT.OBSIDIAN : MAT.BRICK));
                        }
                    } else if (tier === 6) {
                        // Singularity Crystalline Lattice: Void core, Diamond lattice, Void Obsidian, Bedrock anchors, Insulator barriers, Titanium ribs, Plasma/Gravitite veins
                        if (rRatio <= 0.10) {
                            engine.setMat(x, y, MAT.VOID);
                        } else if (rRatio <= 0.18) {
                            engine.setMat(x, y, Math.random() < 0.40 ? MAT.VOID : MAT.BEDROCK);
                        } else if (Math.sin(angle * 12 + dist * 0.06 + p1) > 0.88) {
                            engine.setMat(x, y, MAT.PLSM); // Radiant stellar plasma veins
                        } else if (Math.sin(angle * 7 - dist * 0.08 + p2) > 0.90) {
                            engine.setMat(x, y, MAT.GRAVITITE); // Gravitite antigravity crystal seams
                        } else if (Math.sin(angle * 15 + dist * 0.12 + p1) > 0.87) {
                            engine.setMat(x, y, MAT.INSL); // Quantum insulator ribs
                        } else if (Math.sin(angle * 9 + dist * 0.10 + p2) > 0.88) {
                            engine.setMat(x, y, MAT.GLASS); // Photonic crystal prisms
                        } else if (rRatio <= 0.50) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.45 ? MAT.DIAMOND : (roll < 0.75 ? MAT.BEDROCK : MAT.OBSIDIAN));
                        } else if (rRatio <= 0.80) {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.40 ? MAT.METAL : (roll < 0.70 ? MAT.OBSIDIAN : MAT.DIAMOND));
                        } else {
                            const roll = Math.random();
                            engine.setMat(x, y, roll < 0.40 ? MAT.DIAMOND : (roll < 0.70 ? MAT.OBSIDIAN : MAT.CONCRETE));
                        }
                    }
                }
            }
        }

        if (tier === 2) {
            const seaLevelR = baseSurfaceR + (rCells * 0.012);
            for (let y = 0; y < engine.height; y++) {
                for (let x = 0; x < engine.width; x++) {
                    const dist = Math.hypot(x - engine.cx, y - engine.cy);
                    if (dist <= seaLevelR && engine.getMat(x, y) === MAT.AIR) {
                        engine.setMat(x, y, MAT.WATER);
                    }
                }
            }
            for (let deg = 0; deg < 360; deg += 3) {
                const rad = (deg / 180) * Math.PI;
                const r = engine.getSurfaceRadiusAtAngle(rad) / engine.scale;
                const px = Math.round(engine.cx + Math.cos(rad) * (r + 1));
                const py = Math.round(engine.cy + Math.sin(rad) * (r + 1));
                if (px >= 0 && px < engine.width && py >= 0 && py < engine.height && engine.getMat(px, py) === MAT.AIR) {
                    engine.setMat(px, py, MAT.FLORA);
                }
            }
        } else if (tier === 3) {
            const seaLevelR = baseSurfaceR + (rCells * 0.015);
            for (let y = 0; y < engine.height; y++) {
                for (let x = 0; x < engine.width; x++) {
                    const dist = Math.hypot(x - engine.cx, y - engine.cy);
                    if (dist <= seaLevelR && engine.getMat(x, y) === MAT.AIR) {
                        engine.setMat(x, y, MAT.OIL);
                    }
                }
            }
        }

        // Sleep deep interior chunks so only the active outer crust shell runs physics
        if (engine.chunkActive) {
            engine.chunkActive.fill(0);
            for (let deg = 0; deg < 360; deg += 2) {
                const rad = (deg / 180) * Math.PI;
                const surfWorldR = engine.getSurfaceRadiusAtAngle(rad);
                const surfGridR = surfWorldR / engine.scale;
                for (let depth = 0; depth <= 35; depth += 8) {
                    const gx = Math.round(engine.cx + Math.cos(rad) * (surfGridR - depth));
                    const gy = Math.round(engine.cy + Math.sin(rad) * (surfGridR - depth));
                    engine.wakeChunk(gx, gy);
                }
            }
        }

        engine.updateSurfaceCache();
        this.coreMaxVoxels = 0;
        this.measureCoreHealth();

        if (this.metaPerks.startingPermit.level > 0) {
            const bonusStardust = this.metaPerks.startingPermit.level * this.metaPerks.startingPermit.bonusPerLevel;
            this.addStardust(bonusStardust);
        }
    }

    /**
     * Update autonomous orbital weapons, visual entities & simulation loop
     */
    update(dt) {
        if (this.isSupernovaActive) {
            this.supernovaTimer -= dt;
            if (this.supernovaTimer <= 0) {
                this.spawnNewPlanet(this.currentTier);
            }
            return;
        }

        const coolReduction = Math.max(0.35, 1.0 - (this.metaPerks.orbitalAcceleration.level * this.metaPerks.orbitalAcceleration.bonusPerLevel));

        // 1. Autonomous Asteroid Swarms
        const tug = this.upgrades.asteroidTugs;
        if (tug.level > 0) {
            tug.timer -= dt;
            const targetCooldown = (tug.cooldown / Math.pow(1.12, tug.level - 1)) * coolReduction;
            if (tug.timer <= 0) {
                this.firePassiveAsteroid();
                tug.timer = targetCooldown;
            }
        }

        // 2. Autonomous Kinetic Penetrators (Rods from God)
        const rods = this.upgrades.kineticRods;
        if (rods.level > 0) {
            rods.timer -= dt;
            const targetCooldown = (rods.cooldown / Math.pow(1.10, rods.level - 1)) * coolReduction;
            if (rods.timer <= 0) {
                this.fireKineticRod();
                rods.timer = targetCooldown;
            }
        }

        // 3. Autonomous Thermal Laser
        const laser = this.upgrades.thermalLaser;
        if (laser.level > 0) {
            laser.timer -= dt;
            const targetCooldown = (laser.cooldown / Math.pow(1.12, laser.level - 1)) * coolReduction;
            if (laser.timer <= 0) {
                this.fireThermalLaser();
                laser.timer = targetCooldown;
            }
        }

        // 4. Autonomous Acid Rain Drones
        const acid = this.upgrades.acidDrones;
        if (acid.level > 0) {
            acid.timer -= dt;
            const targetCooldown = (acid.cooldown / Math.pow(1.14, acid.level - 1)) * coolReduction;
            if (acid.timer <= 0) {
                this.fireAcidDroneFleet();
                acid.timer = targetCooldown;
            }
        }

        // 5. Autonomous Thermonuclear Bombers
        const nuke = this.upgrades.nuclearBomber;
        if (nuke.level > 0) {
            nuke.timer -= dt;
            const targetCooldown = (nuke.cooldown / Math.pow(1.15, nuke.level - 1)) * coolReduction;
            if (nuke.timer <= 0) {
                this.fireNuclearBomber();
                nuke.timer = targetCooldown;
            }
        }

        // 6. Periodic Core Health Tracking
        if (Math.random() < 0.15) {
            this.measureCoreHealth();
        }

        // 7. Update Visual FX & Projectile Entities
        for (let i = this.visualEntities.length - 1; i >= 0; i--) {
            const ent = this.visualEntities[i];
            ent.life -= dt;
            if (ent.update) ent.update(dt);
            if (ent.life <= 0) {
                this.visualEntities.splice(i, 1);
            }
        }

        // 8. Update Floating Stardust Text
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy * dt;
            ft.life -= dt;
            ft.alpha = Math.max(0, ft.life / 0.95);
            if (ft.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    // ==========================================
    // DISTINCT CINEMATIC WEAPON LAUNCHERS & FX
    // ==========================================

    /**
     * Weapon 1: Fiery Asteroid Bolide
     */
    firePassiveAsteroid() {
        const engine = this.game.sandEngine;
        if (!engine) return;

        // Target highest remaining surface peak on the planetary crust
        const target = engine.getHighestSurfaceTarget ? engine.getHighestSurfaceTarget(14) : { angle: Math.random() * Math.PI * 2, radius: engine.getSurfaceRadiusAtAngle(0), x: 0, y: 0 };
        const targetAngle = target.angle;
        const targetR = target.radius;
        const tx = target.x;
        const ty = target.y;

        // Origin high above in deep space facing this exact surface region
        const launchAngle = targetAngle + (Math.random() - 0.5) * 0.35;
        const launchDist = targetR + 700 + Math.random() * 200;
        const sx = Math.cos(launchAngle) * launchDist;
        const sy = Math.sin(launchAngle) * launchDist;

        const sizeLvl = this.upgrades.asteroidSize.level;
        const meteorRadius = 14 + sizeLvl * 4;
        const blastRadius = 26 + sizeLvl * 6;
        const isExotic = Math.random() < (this.metaPerks.exoticPayloads.level * this.metaPerks.exoticPayloads.bonusPerLevel);

        const travelTime = 1.3;
        const dx = tx - sx;
        const dy = ty - sy;

        const incEngine = this;

        // Visual meteor entity with real surface impact trigger
        this.visualEntities.push({
            type: 'meteor',
            x: sx,
            y: sy,
            vx: dx / travelTime,
            vy: dy / travelTime,
            targetX: tx,
            targetY: ty,
            targetR,
            radius: meteorRadius,
            blastRadius,
            sizeLvl,
            isExotic,
            trail: [],
            rot: Math.random() * Math.PI * 2,
            rotSpeed: 3.5,
            life: travelTime,
            engine,
            incEngine,
            hasDetonated: false,
            update: function(dt) {
                this.x += this.vx * dt;
                this.y += this.vy * dt;
                this.rot += this.rotSpeed * dt;
                this.trail.push({ x: this.x, y: this.y, life: 0.35, maxLife: 0.35 });
                for (let k = this.trail.length - 1; k >= 0; k--) {
                    this.trail[k].life -= dt;
                    if (this.trail[k].life <= 0) this.trail.splice(k, 1);
                }

                // Check for collision with planetary surface
                const curDist = Math.hypot(this.x, this.y);
                if (!this.hasDetonated && (curDist <= this.targetR + 4 || this.life <= 0.05)) {
                    this.hasDetonated = true;
                    this.life = 0;
                    this.engine.carveExplosion(this.x, this.y, this.blastRadius, { pushPower: 2.4, isMagma: this.isExotic });
                    
                    // Generous stardust bounty for deep-space meteor impacts
                    const stardustYield = Math.round((this.blastRadius * 9 + this.sizeLvl * 60) * (this.isExotic ? 2.5 : 1.0));
                    this.incEngine.addStardust(stardustYield, this.x, this.y);
                    this.incEngine.spawnFloatingText(`+${stardustYield} ☄️`, this.x, this.y, '#f59e0b');
                    
                    this.incEngine.game.triggerScreenShake(4.5, 0.2);
                    sound.playExplosion(1.0);
                }
            }
        });

        sound.playShoot('plasma');
    }

    /**
     * Weapon 2: Hypersonic Kinetic Penetrators (Rods from God)
     * Deep Mantle Borehole Penetration & Mach Shockwave
     */
    fireKineticRod() {
        const engine = this.game.sandEngine;
        if (!engine) return;

        const target = engine.getHighestSurfaceTarget ? engine.getHighestSurfaceTarget(14) : { angle: Math.random() * Math.PI * 2, radius: engine.getSurfaceRadiusAtAngle(0), x: 0, y: 0 };
        const angle = target.angle;
        const targetR = target.radius;
        const hitX = target.x;
        const hitY = target.y;

        // Origin in high orbit facing directly towards this surface sector
        const startDist = targetR + 850;
        const startX = Math.cos(angle) * startDist;
        const startY = Math.sin(angle) * startDist;

        const rodLvl = this.upgrades.kineticRods.level;
        const rodPower = 34 + rodLvl * 12;
        const travelTime = 0.35; // Blistering hypersonic descent

        const incEngine = this;

        // Hypersonic glowing dart visual entity
        this.visualEntities.push({
            type: 'kinetic_rod',
            x: startX,
            y: startY,
            vx: (hitX - startX) / travelTime,
            vy: (hitY - startY) / travelTime,
            startX,
            startY,
            hitX,
            hitY,
            angle: angle + Math.PI,
            life: travelTime,
            machRings: [],
            update: function(dt) {
                this.x += this.vx * dt;
                this.y += this.vy * dt;
                // Emit mach shock diamond rings
                if (Math.random() < 0.6) {
                    this.machRings.push({ x: this.x, y: this.y, r: 4, alpha: 0.9 });
                }
                for (let k = this.machRings.length - 1; k >= 0; k--) {
                    this.machRings[k].r += dt * 120;
                    this.machRings[k].alpha -= dt * 2.8;
                    if (this.machRings[k].alpha <= 0) this.machRings.splice(k, 1);
                }
            }
        });

        // Deep Mantle Borehole Detonation Sequence
        setTimeout(() => {
            if (this.game && this.game.sandEngine) {
                // Multi-Depth Kinetic Penetration Shaft (Punches deep towards core)
                this.game.sandEngine.carveExplosion(hitX, hitY, rodPower, { pushPower: 3.6, vaporizeRatio: 0.85 });
                
                const depth1X = hitX * (1 - 25 / targetR);
                const depth1Y = hitY * (1 - 25 / targetR);
                this.game.sandEngine.carveExplosion(depth1X, depth1Y, rodPower * 0.85, { pushPower: 3.2, vaporizeRatio: 0.9 });

                const depth2X = hitX * (1 - 55 / targetR);
                const depth2Y = hitY * (1 - 55 / targetR);
                this.game.sandEngine.carveExplosion(depth2X, depth2Y, rodPower * 0.70, { pushPower: 3.0, vaporizeRatio: 0.95 });

                const depth3X = hitX * (1 - 85 / targetR);
                const depth3Y = hitY * (1 - 85 / targetR);
                this.game.sandEngine.carveExplosion(depth3X, depth3Y, rodPower * 0.55, { pushPower: 2.8, vaporizeRatio: 0.95 });

                this.addStardust(rodPower * 5, hitX, hitY);
                this.game.triggerScreenShake(7.5, 0.25);
                sound.playExplosion(1.4);

                // Add piercing hypersonic borehole visual impact FX
                this.visualEntities.push({
                    type: 'kinetic_borehole_fx',
                    hitX,
                    hitY,
                    depthX: depth3X,
                    depthY: depth3Y,
                    angle,
                    maxRadius: rodPower * 1.8,
                    life: 0.55,
                    maxLife: 0.55,
                    sparks: Array.from({ length: 14 }, () => ({
                        x: hitX,
                        y: hitY,
                        vx: Math.cos(angle + (Math.random() - 0.5) * 1.4) * (200 + Math.random() * 350),
                        vy: Math.sin(angle + (Math.random() - 0.5) * 1.4) * (200 + Math.random() * 350),
                        life: 0.45
                    })),
                    update: function(dt) {
                        for (let k = 0; k < this.sparks.length; k++) {
                            const s = this.sparks[k];
                            s.x += s.vx * dt;
                            s.y += s.vy * dt;
                            s.life -= dt;
                        }
                    }
                });
            }
        }, travelTime * 1000);

        sound.playShoot('laser');
    }

    /**
     * Weapon 3: Orbital Thermal Laser Lance (Focused Surgical Cut)
     */
    fireThermalLaser() {
        const engine = this.game.sandEngine;
        if (!engine) return;

        const target = engine.getHighestSurfaceTarget ? engine.getHighestSurfaceTarget(14) : { angle: Math.random() * Math.PI * 2, radius: engine.getSurfaceRadiusAtAngle(0), x: 0, y: 0 };
        const baseAngle = target.angle;
        const sweepArc = 0.36;
        const laserLvl = this.upgrades.thermalLaser.level;
        const duration = 1.15;

        // Satellite position high above the planetary surface
        const satDist = (target.radius || 600) + 650;
        const satX = Math.cos(baseAngle) * satDist;
        const satY = Math.sin(baseAngle) * satDist;

        const incEngine = this;

        // Thermal Lance visual beam entity
        this.visualEntities.push({
            type: 'thermal_laser',
            satX,
            satY,
            baseAngle,
            sweepArc,
            duration,
            life: duration,
            laserLvl,
            engine,
            incEngine,
            tickTimer: 0,
            update: function(dt) {
                const progress = 1.0 - (this.life / this.duration);
                const currentAngle = this.baseAngle + (progress - 0.5) * this.sweepArc;
                const rWorld = this.engine.getSurfaceRadiusAtAngle(currentAngle);
                const hitX = Math.cos(currentAngle) * (rWorld - 2);
                const hitY = Math.sin(currentAngle) * (rWorld - 2);

                this.currentHitX = hitX;
                this.currentHitY = hitY;

                // Pulsed high-power surgical carving
                this.tickTimer -= dt;
                if (this.tickTimer <= 0) {
                    this.tickTimer = 0.040;
                    const cutRadius = 8.5 + this.laserLvl * 1.8;
                    this.engine.mineAtWorld(hitX, hitY, cutRadius * 1.25);
                    this.engine.carveExplosion(hitX, hitY, cutRadius * 0.75, { vaporizeRatio: 0.92, pushPower: 0.8 });
                    if (Math.random() < 0.40) {
                        this.engine.paintWorld(hitX, hitY, 3, Math.random() < 0.35 ? MAT.PLSM : MAT.FIRE);
                    }
                }
            }
        });

        this.addStardust(75 * Math.max(1, laserLvl), satX * 0.4, satY * 0.4);
        sound.playShoot('laser');
    }

    /**
     * Weapon 4: Corrosive Acid Seeder Drone Fleet
     */
    fireAcidDroneFleet() {
        const engine = this.game.sandEngine;
        if (!engine) return;

        const target = engine.getHighestSurfaceTarget ? engine.getHighestSurfaceTarget(14) : { angle: Math.random() * Math.PI * 2, radius: engine.getSurfaceRadiusAtAngle(0), x: 0, y: 0 };
        const angle = target.angle;
        const rWorld = target.radius;
        const targetX = target.x;
        const targetY = target.y;

        const droneDist = rWorld + 320;
        const droneX = Math.cos(angle) * droneDist;
        const droneY = Math.sin(angle) * droneDist;

        const acidLvl = this.upgrades.acidDrones.level;
        const duration = 2.4;

        // Acid Drone visual entity
        this.visualEntities.push({
            type: 'acid_drone',
            x: droneX,
            y: droneY,
            targetX,
            targetY,
            angle,
            acidLvl,
            duration,
            life: duration,
            drops: [],
            dropTimer: 0.05,
            engine,
            update: function(dt) {
                this.dropTimer -= dt;
                if (this.dropTimer <= 0) {
                    this.dropTimer = 0.055;
                    // Spawn dense salvo of falling acid droplets
                    const numDrops = 2;
                    for (let i = 0; i < numDrops; i++) {
                        const dropOffset = (Math.random() - 0.5) * 60;
                        this.drops.push({
                            x: this.x + Math.cos(this.angle + Math.PI/2) * dropOffset,
                            y: this.y + Math.sin(this.angle + Math.PI/2) * dropOffset,
                            vx: Math.cos(this.angle + Math.PI + (Math.random() - 0.5) * 0.15) * (360 + Math.random() * 80),
                            vy: Math.sin(this.angle + Math.PI + (Math.random() - 0.5) * 0.15) * (360 + Math.random() * 80),
                            life: 2.5
                        });
                    }
                }

                for (let k = this.drops.length - 1; k >= 0; k--) {
                    const d = this.drops[k];
                    d.x += d.vx * dt;
                    d.y += d.vy * dt;
                    d.life -= dt;

                    const curDist = Math.hypot(d.x, d.y);
                    const curAngle = Math.atan2(d.y, d.x);
                    const surfaceR = this.engine.getSurfaceRadiusAtAngle(curAngle);

                    if (curDist <= surfaceR || d.life <= 0) {
                        const impactX = (curDist <= surfaceR) ? d.x : Math.cos(curAngle) * surfaceR;
                        const impactY = (curDist <= surfaceR) ? d.y : Math.sin(curAngle) * surfaceR;

                        // 1. Initial corrosive chemical dissolution crater
                        const dissolveRadius = 22 + this.acidLvl * 3.2;
                        this.engine.carveExplosion(impactX, impactY, dissolveRadius, { pushPower: 1.4, vaporizeRatio: 0.88 });

                        // 2. Deposit concentrated streaming acid fluid to bore deep chemical tunnels into crust
                        const acidSplashR = 12 + this.acidLvl * 1.8;
                        this.engine.paintWorld(impactX, impactY, acidSplashR, MAT.ACID);

                        // 3. Emit effervescent smoke and audio feedback
                        const cellPos = this.engine.worldToGrid(impactX, impactY);
                        this.engine.emitGas(cellPos.x, cellPos.y, MAT.SMOKE, 4);

                        this.drops.splice(k, 1);
                    }
                }
            }
        });

        this.addStardust(140 * Math.max(1, acidLvl), targetX, targetY);
        sound.playShoot('cluster');
    }

    /**
     * Weapon 6: Thermonuclear Satellites (Cataclysmic MIRV Strategic Strike)
     */
    fireNuclearBomber() {
        const engine = this.game.sandEngine;
        if (!engine) return;

        const target = engine.getHighestSurfaceTarget ? engine.getHighestSurfaceTarget(16) : { angle: Math.random() * Math.PI * 2, radius: engine.getSurfaceRadiusAtAngle(0), x: 0, y: 0 };
        const angle = target.angle;
        const rWorld = target.radius;
        const hitX = Math.cos(angle) * (rWorld - 12);
        const hitY = Math.sin(angle) * (rWorld - 12);

        // Flank impact positions for MIRV sub-warheads
        const leftAngle = angle + 0.16;
        const rightAngle = angle - 0.16;
        const rLeft = engine.getSurfaceRadiusAtAngle(leftAngle);
        const rRight = engine.getSurfaceRadiusAtAngle(rightAngle);
        const hitLeftX = Math.cos(leftAngle) * (rLeft - 10);
        const hitLeftY = Math.sin(leftAngle) * (rLeft - 10);
        const hitRightX = Math.cos(rightAngle) * (rRight - 10);
        const hitRightY = Math.sin(rightAngle) * (rRight - 10);

        const startDist = rWorld + 950;
        const startX = Math.cos(angle) * startDist;
        const startY = Math.sin(angle) * startDist;

        const nukeLvl = this.upgrades.nuclearBomber.level;
        const nukeRadius = 130 + nukeLvl * 32;
        const fallTime = 1.3;

        // Primary Nuclear Warhead visual entity
        this.visualEntities.push({
            type: 'nuke_bomb',
            x: startX,
            y: startY,
            vx: (hitX - startX) / fallTime,
            vy: (hitY - startY) / fallTime,
            angle: angle + Math.PI,
            beacon: 0,
            life: fallTime,
            update: function(dt) {
                this.x += this.vx * dt;
                this.y += this.vy * dt;
                this.beacon += dt * 14;
            }
        });

        // Left Sub-Warhead
        this.visualEntities.push({
            type: 'nuke_bomb',
            x: startX + Math.cos(angle + Math.PI/2) * 50,
            y: startY + Math.sin(angle + Math.PI/2) * 50,
            vx: (hitLeftX - (startX + Math.cos(angle + Math.PI/2) * 50)) / fallTime,
            vy: (hitLeftY - (startY + Math.sin(angle + Math.PI/2) * 50)) / fallTime,
            angle: leftAngle + Math.PI,
            beacon: 1.5,
            life: fallTime,
            update: function(dt) {
                this.x += this.vx * dt;
                this.y += this.vy * dt;
                this.beacon += dt * 14;
            }
        });

        // Right Sub-Warhead
        this.visualEntities.push({
            type: 'nuke_bomb',
            x: startX - Math.cos(angle + Math.PI/2) * 50,
            y: startY - Math.sin(angle + Math.PI/2) * 50,
            vx: (hitRightX - (startX - Math.cos(angle + Math.PI/2) * 50)) / fallTime,
            vy: (hitRightY - (startY - Math.sin(angle + Math.PI/2) * 50)) / fallTime,
            angle: rightAngle + Math.PI,
            beacon: 3.0,
            life: fallTime,
            update: function(dt) {
                this.x += this.vx * dt;
                this.y += this.vy * dt;
                this.beacon += dt * 14;
            }
        });

        // Multi-Megaton Detonation Sequence
        setTimeout(() => {
            if (this.game && this.game.sandEngine) {
                // 1. Primary Epicenter Blast
                this.game.sandEngine.carveExplosion(hitX, hitY, nukeRadius, { pushPower: 5.2, vaporizeRatio: 0.95 });
                
                // 2. Deep Mantle Borehole Cavity
                this.game.sandEngine.carveExplosion(hitX * 0.78, hitY * 0.78, nukeRadius * 0.85, { pushPower: 4.6, vaporizeRatio: 0.95 });

                // 3. Flank MIRV Detonations
                this.game.sandEngine.carveExplosion(hitLeftX, hitLeftY, nukeRadius * 0.70, { pushPower: 4.2, vaporizeRatio: 0.90 });
                this.game.sandEngine.carveExplosion(hitRightX, hitRightY, nukeRadius * 0.70, { pushPower: 4.2, vaporizeRatio: 0.90 });

                // 4. Core Plasma Flash Synthesis
                this.game.sandEngine.paintWorld(hitX, hitY, nukeRadius * 0.65, MAT.PLSM);

                // 5. Huge Stardust Reward
                const stardustEarned = Math.round(12000 + nukeRadius * 60 * nukeLvl);
                this.addStardust(stardustEarned, hitX, hitY);
                this.spawnFloatingText(`+${stardustEarned} ☢️ THERMONUCLEAR DETONATION!`, hitX, hitY - 45, '#fde047');

                this.game.triggerScreenShake(22, 0.85);
                sound.playExplosion(3.0);

                // Add expanding multi-ring solar plasma fireball FX
                this.visualEntities.push({
                    type: 'nuke_blast_fx',
                    x: hitX,
                    y: hitY,
                    maxRadius: nukeRadius * 2.5,
                    life: 1.1,
                    maxLife: 1.1,
                    update: function(dt) {}
                });
            }
        }, fallTime * 1000);

        sound.playShoot('plasma');
    }

    /**
     * Draw Floating Stardust, Projectiles, Lasers & Distinct Weapon FX
     */
    draw(ctx, camera, screenWidth, screenHeight) {
        if (!ctx) return;

        // Clear transparent FX Canvas overlay
        ctx.clearRect(0, 0, screenWidth, screenHeight);

        ctx.save();
        // Match WebGL Camera Transform
        ctx.translate(screenWidth / 2, screenHeight / 2);
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-camera.x, -camera.y);

        // 1. Draw Visual Weapon Entities
        for (let i = 0; i < this.visualEntities.length; i++) {
            const ent = this.visualEntities[i];

            if (ent.type === 'meteor') {
                // Flaming Meteor Trail
                for (let k = 0; k < ent.trail.length; k++) {
                    const t = ent.trail[k];
                    const tAlpha = (t.life / t.maxLife) * 0.7;
                    ctx.fillStyle = ent.isExotic ? `rgba(255, 0, 255, ${tAlpha})` : `rgba(255, 120, 0, ${tAlpha})`;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, ent.radius * 0.6 * (t.life / t.maxLife), 0, Math.PI * 2);
                    ctx.fill();
                }

                // Meteor Body & Fiery Atmosphere Burn Core
                ctx.save();
                ctx.translate(ent.x, ent.y);
                ctx.rotate(ent.rot);
                ctx.fillStyle = ent.isExotic ? '#d946ef' : '#ff5500';
                ctx.shadowColor = ent.isExotic ? '#ff00ff' : '#ff8800';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(0, 0, ent.radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(0, 0, ent.radius * 0.45, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else if (ent.type === 'kinetic_rod') {
                // Mach Shock Diamond Rings
                if (ent.machRings) {
                    for (let k = 0; k < ent.machRings.length; k++) {
                        const mr = ent.machRings[k];
                        ctx.save();
                        ctx.strokeStyle = `rgba(0, 240, 255, ${mr.alpha})`;
                        ctx.lineWidth = 2;
                        ctx.shadowColor = '#00f0ff';
                        ctx.shadowBlur = 8;
                        ctx.beginPath();
                        ctx.arc(mr.x, mr.y, mr.r, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.restore();
                    }
                }

                // Hypersonic Tungsten Penetrator Spike
                ctx.save();
                ctx.translate(ent.x, ent.y);
                ctx.rotate(ent.angle);
                
                // Blue/Cyan Ionization Plasma Shock Sheath & Trail
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 6;
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 18;
                ctx.beginPath();
                ctx.moveTo(0, -45);
                ctx.lineTo(0, 45);
                ctx.stroke();

                // Inner White-Hot Plasma Core
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(0, -35);
                ctx.lineTo(0, 40);
                ctx.stroke();

                // Heavy Solid Tungsten Dart Head
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(0, 48);
                ctx.lineTo(-6, -15);
                ctx.lineTo(6, -15);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            } else if (ent.type === 'kinetic_borehole_fx') {
                // Hypersonic Piercing Borehole Pillar & Shockwave
                const progress = 1.0 - (ent.life / ent.maxLife);
                const alpha = ent.life / ent.maxLife;

                ctx.save();
                // 1. Vertical Ionization Borehole Pillar into Mantle
                ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                ctx.lineWidth = 10 * alpha;
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 24;
                ctx.beginPath();
                ctx.moveTo(ent.hitX, ent.hitY);
                ctx.lineTo(ent.depthX, ent.depthY);
                ctx.stroke();

                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = 4 * alpha;
                ctx.beginPath();
                ctx.moveTo(ent.hitX, ent.hitY);
                ctx.lineTo(ent.depthX, ent.depthY);
                ctx.stroke();

                // 2. High-Velocity Kinetic Sparks
                if (ent.sparks) {
                    ctx.fillStyle = '#00f0ff';
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 6;
                    for (let k = 0; k < ent.sparks.length; k++) {
                        const s = ent.sparks[k];
                        if (s.life > 0) {
                            ctx.beginPath();
                            ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }

                // 3. Supersonic Shockwave Ring
                const curRadius = ent.maxRadius * progress;
                ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.8})`;
                ctx.lineWidth = 4 * alpha;
                ctx.beginPath();
                ctx.arc(ent.hitX, ent.hitY, curRadius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            } else if (ent.type === 'thermal_laser') {
                // Orbital Satellite Emitter
                ctx.save();
                ctx.fillStyle = '#cbd5e1';
                ctx.beginPath();
                ctx.arc(ent.satX, ent.satY, 14, 0, Math.PI * 2);
                ctx.fill();

                // Solar panels
                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(ent.satX - 35, ent.satY - 4, 20, 8);
                ctx.fillRect(ent.satX + 15, ent.satY - 4, 20, 8);

                // Intense Neon Thermal Laser Beam
                if (ent.currentHitX !== undefined) {
                    ctx.strokeStyle = '#ff007f';
                    ctx.lineWidth = 14;
                    ctx.shadowColor = '#ff00ff';
                    ctx.shadowBlur = 28;
                    ctx.beginPath();
                    ctx.moveTo(ent.satX, ent.satY);
                    ctx.lineTo(ent.currentHitX, ent.currentHitY);
                    ctx.stroke();

                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(ent.satX, ent.satY);
                    ctx.lineTo(ent.currentHitX, ent.currentHitY);
                    ctx.stroke();

                    // Ground Scorch Flash & Molten Incision Glow
                    ctx.fillStyle = '#ff6600';
                    ctx.shadowColor = '#ffaa00';
                    ctx.shadowBlur = 18;
                    ctx.beginPath();
                    ctx.arc(ent.currentHitX, ent.currentHitY, 22, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(ent.currentHitX, ent.currentHitY, 10, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            } else if (ent.type === 'acid_drone') {
                // Stealth Drone Body
                ctx.save();
                ctx.translate(ent.x, ent.y);
                ctx.rotate(ent.angle + Math.PI/2);
                ctx.fillStyle = '#1e293b';
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -14);
                ctx.lineTo(-18, 14);
                ctx.lineTo(18, 14);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Blinking green sensor
                ctx.fillStyle = '#39ff14';
                ctx.shadowColor = '#39ff14';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                // Glowing Acid Drops
                for (let k = 0; k < ent.drops.length; k++) {
                    const d = ent.drops[k];
                    ctx.fillStyle = '#39ff14';
                    ctx.shadowColor = '#00ff66';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(d.x, d.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (ent.type === 'nuke_bomb') {
                // Nuclear Bomb Warhead
                ctx.save();
                ctx.translate(ent.x, ent.y);
                ctx.rotate(ent.angle);
                ctx.fillStyle = '#475569';
                ctx.fillRect(-6, -16, 12, 32);
                ctx.fillStyle = '#eab308';
                ctx.beginPath();
                ctx.arc(0, 16, 6, 0, Math.PI * 2);
                ctx.fill();

                // Blinking Red Beacon Light
                if (Math.sin(ent.beacon) > 0) {
                    ctx.fillStyle = '#ef4444';
                    ctx.shadowColor = '#ff0000';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(0, -16, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            } else if (ent.type === 'nuke_blast_fx') {
                // Cataclysmic Multi-Ring Thermonuclear Solar Fireball
                const blastProgress = 1.0 - (ent.life / ent.maxLife);
                const curRadius = ent.maxRadius * blastProgress;
                const alpha = ent.life / ent.maxLife;

                ctx.save();
                // 1. Outer Supersonic Atmospheric Shockwave Ring
                ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.85})`;
                ctx.lineWidth = 6 * alpha;
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.arc(ent.x, ent.y, curRadius * 1.08, 0, Math.PI * 2);
                ctx.stroke();

                // 2. Mid Fiery Golden Plasma Wave
                ctx.strokeStyle = `rgba(255, 200, 0, ${alpha * 0.95})`;
                ctx.lineWidth = 10 * alpha;
                ctx.shadowColor = '#ff6600';
                ctx.shadowBlur = 35;
                ctx.beginPath();
                ctx.arc(ent.x, ent.y, curRadius * 0.85, 0, Math.PI * 2);
                ctx.stroke();

                // 3. Inner White-Hot Nuclear Fusion Core
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 40;
                ctx.beginPath();
                ctx.arc(ent.x, ent.y, curRadius * 0.55, 0, Math.PI * 2);
                ctx.fill();

                // 4. Radiant Solar Flare Rays
                ctx.strokeStyle = `rgba(255, 220, 100, ${alpha * 0.6})`;
                ctx.lineWidth = 3;
                for (let r = 0; r < 8; r++) {
                    const rayAngle = (r / 8) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(ent.x + Math.cos(rayAngle) * curRadius * 0.4, ent.y + Math.sin(rayAngle) * curRadius * 0.4);
                    ctx.lineTo(ent.x + Math.cos(rayAngle) * curRadius * 1.15, ent.y + Math.sin(rayAngle) * curRadius * 1.15);
                    ctx.stroke();
                }
                ctx.restore();
            }
        }

        // 2. Draw Floating Stardust / Damage Text
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.textAlign = 'center';
        for (let i = 0; i < this.floatingTexts.length; i++) {
            const ft = this.floatingTexts[i];
            ctx.fillStyle = ft.color;
            ctx.globalAlpha = ft.alpha;
            ctx.fillText(ft.text, ft.x, ft.y);
        }

        ctx.restore();
    }

    // LocalStorage Save & Load
    saveGame() {
        try {
            const data = {
                stardust: this.stardust,
                totalStardustEarned: this.totalStardustEarned,
                omegaCores: this.omegaCores,
                totalOmegaCoresEarned: this.totalOmegaCoresEarned,
                planetsDestroyed: this.planetsDestroyed,
                currentTier: this.currentTier,
                maxUnlockedTier: this.maxUnlockedTier,
                upgrades: Object.fromEntries(Object.entries(this.upgrades).map(([k, v]) => [k, v.level])),
                metaPerks: Object.fromEntries(Object.entries(this.metaPerks).map(([k, v]) => [k, v.level]))
            };
            localStorage.setItem('gravity_wars_save', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save incremental progress:', e);
        }
    }

    loadGame() {
        try {
            const raw = localStorage.getItem('gravity_wars_save');
            if (!raw) return;
            const data = JSON.parse(raw);

            if (data.stardust !== undefined) this.stardust = data.stardust;
            if (data.totalStardustEarned !== undefined) this.totalStardustEarned = data.totalStardustEarned;
            if (data.omegaCores !== undefined) this.omegaCores = data.omegaCores;
            if (data.totalOmegaCoresEarned !== undefined) this.totalOmegaCoresEarned = data.totalOmegaCoresEarned;
            if (data.planetsDestroyed !== undefined) this.planetsDestroyed = data.planetsDestroyed;
            if (data.currentTier !== undefined) this.currentTier = data.currentTier;
            if (data.maxUnlockedTier !== undefined) this.maxUnlockedTier = data.maxUnlockedTier;

            if (data.upgrades) {
                for (const [k, lvl] of Object.entries(data.upgrades)) {
                    if (this.upgrades[k]) this.upgrades[k].level = lvl;
                }
            }
            if (data.metaPerks) {
                for (const [k, lvl] of Object.entries(data.metaPerks)) {
                    if (this.metaPerks[k]) this.metaPerks[k].level = lvl;
                }
            }
        } catch (e) {
            console.warn('Failed to load incremental save:', e);
        }
    }
}
