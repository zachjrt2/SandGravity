// Planetary Physics & Celestial Body Entity for Gravity Wars
import { PlanetTerrain, MAT } from './terrain.js';
import { sound } from './audio.js';

export class Planet {
    constructor(config) {
        this.id = config.id || ('p_' + Math.random().toString(36).substr(2, 9));
        this.name = config.name || 'Planet';
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.orbitalTrail = [];

        // Base geometric scale
        this.baseRadius = config.radius || 150;
        this.radius = this.baseRadius;
        this.targetRadius = this.baseRadius;
        
        // Continuous orbital parameters
        this.orbitCenter = config.orbitCenter || { x: 0, y: 0 };
        this.orbitRadius = config.orbitRadius !== undefined ? config.orbitRadius : Math.hypot(this.x - this.orbitCenter.x, this.y - this.orbitCenter.y);
        this.orbitAngle = config.orbitAngle !== undefined ? config.orbitAngle : Math.atan2(this.y - this.orbitCenter.y, this.x - this.orbitCenter.x);
        this.orbitSpeed = config.orbitSpeed !== undefined ? config.orbitSpeed : ((Math.random() > 0.5 ? 1 : -1) * (0.04 + Math.random() * 0.03));

        // Initial stable Keplerian orbital velocity (fast continuous orbit)
        if (config.vx !== undefined && config.vy !== undefined) {
            this.vx = config.vx;
            this.vy = config.vy;
        } else if (this.orbitRadius > 10) {
            const tangAngle = this.orbitAngle + (this.orbitSpeed > 0 ? Math.PI / 2 : -Math.PI / 2);
            const keplerSpd = Math.sqrt((38000 * 1800) / Math.max(80, this.orbitRadius)) * (0.92 + Math.random() * 0.16);
            this.vx = Math.cos(tangAngle) * keplerSpd;
            this.vy = Math.sin(tangAngle) * keplerSpd;
        } else {
            this.vx = 0;
            this.vy = 0;
        }

        // Mass & Celestial Type
        this.isBlackHole = config.isBlackHole || false;
        this.isStar = config.isStar || false;
        this.isRepulsor = config.isRepulsor || false;
        this.mass = config.mass || this.calculateMass(this.radius);
        this.targetMass = this.mass;
        this.isDead = false;

        // Visual theme
        this.type = config.type || 'rocky';
        this.color1 = config.color1 || '#4a752c';
        this.color2 = config.color2 || '#2e491b';
        this.atmosphereColor = config.atmosphereColor || 'rgba(100, 200, 255, 0.35)';
        this.glowColor = config.glowColor || 'rgba(80, 180, 255, 0.5)';
        this.hasRings = config.hasRings || false;
        this.ringColor = config.ringColor || 'rgba(230, 200, 160, 0.6)';
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;

        // Gravitational influence radius
        this.gravityRadius = config.gravityRadius || 2400;
        this.pulsePhase = Math.random() * Math.PI * 2;

        // Granular Pixel & Falling Sand Terrain Engine (Entirely Destructible, Coreless)
        if (!this.isBlackHole && !this.isStar) {
            this.terrain = new PlanetTerrain(this, this.radius, config);
            this.mass = this.terrain.totalTerrainMass;
            this.targetMass = this.mass;
        } else {
            this.terrain = null;
        }
    }

    calculateMass(radius) {
        if (this.isBlackHole) return radius * 14;
        if (this.isStar) return radius * 7.5;
        if (this.isRepulsor) return -radius * 4.5;
        return radius * 3.8;
    }

    getCenterOfMass() {
        if (this.terrain && this.terrain.centerOfMass) {
            return this.terrain.centerOfMass;
        }
        return { x: this.x, y: this.y };
    }

    /**
     * Compute terrain-based real-time gravity vector pulling at world position (wx, wy)
     */
    getGravitationalPullAt(wx, wy, gravFactor = 1.0) {
        if (this.isDead) return { fx: 0, fy: 0 };

        if (this.terrain) {
            return this.terrain.getGravitationalForceAt(wx, wy, gravFactor);
        }

        // Analytic singularity (Black holes, Stars, Repulsor crystals)
        const dx = this.x - wx;
        const dy = this.y - wy;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist > this.gravityRadius || dist < 1) return { fx: 0, fy: 0 };

        let fx = 0;
        let fy = 0;

        const force = (this.mass * 38000 * gravFactor) / (distSq + 1200);
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;

        // Repulsor Quantum Deflection Wave
        if (this.isRepulsor && dist < this.radius * 2.8) {
            const repulsePush = (Math.abs(this.mass) * 1200) / (distSq + 400);
            fx -= (dx / dist) * repulsePush;
            fy -= (dy / dist) * repulsePush;
        }

        return { fx, fy };
    }

    advanceTurnOrbit() {
        if (this.orbitRadius > 10) {
            const curAngle = Math.atan2(this.y - this.orbitCenter.y, this.x - this.orbitCenter.x);
            const tangAngle = curAngle + (this.orbitSpeed > 0 ? Math.PI / 2 : -Math.PI / 2);
            const boost = 20;
            this.vx += Math.cos(tangAngle) * boost;
            this.vy += Math.sin(tangAngle) * boost;
        }
    }

    update(dt, game = null) {
        this.rotation += this.rotationSpeed * dt;
        this.pulsePhase += dt * 2;

        // Continuous Keplerian Orbital Mechanics: Maintain fast stable orbit around system center
        if (this.orbitRadius > 10) {
            const curAngle = Math.atan2(this.y - this.orbitCenter.y, this.x - this.orbitCenter.x);
            const isCCW = (this.orbitSpeed === undefined || this.orbitSpeed >= 0);
            const tangAngle = curAngle + (isCCW ? Math.PI / 2 : -Math.PI / 2);

            // Keplerian orbital velocity v = sqrt(GM / r) around central barycenter
            const targetSpd = Math.sqrt((38000 * 2400) / Math.max(120, this.orbitRadius));
            const targetVx = Math.cos(tangAngle) * targetSpd;
            const targetVy = Math.sin(tangAngle) * targetSpd;

            // Stable blending so orbits remain wide & circular while responding to N-body gravity
            this.vx += (targetVx - this.vx) * 2.0 * dt;
            this.vy += (targetVy - this.vy) * 2.0 * dt;
        }

        // Smoothly interpolate radius size
        if (Math.abs(this.radius - this.targetRadius) > 0.1) {
            this.radius += (this.targetRadius - this.radius) * 4 * dt;
        } else {
            this.radius = this.targetRadius;
        }

        // Step falling sand & granular avalanche simulation with multi-body gravity
        if (this.terrain) {
            this.terrain.update(dt, game);
            this.mass = this.terrain.totalTerrainMass;
            this.targetMass = this.mass;

            // If planet is completely pulverized/excavated below critical mass, shatter into free orbital debris
            if (Math.abs(this.mass) < 6 && this.terrain.activeBlockIndices.length === 0) {
                this.shatter(game);
            }
        } else {
            if (Math.abs(this.mass - this.targetMass) > 0.5) {
                this.mass += (this.targetMass - this.mass) * 4 * dt;
            } else {
                this.mass = this.targetMass;
            }
        }

        // Real-Time Roche Limit Tidal Siphoning
        if (game && game.planets && Math.random() < 0.22) {
            for (let i = 0; i < game.planets.length; i++) {
                const other = game.planets[i];
                if (other === this || other.isDead) continue;
                const dx = other.x - this.x;
                const dy = other.y - this.y;
                const dist = Math.hypot(dx, dy);
                const rocheLimit = (this.radius + other.radius) * 1.55;

                if (dist < rocheLimit && this.mass < other.mass && this.terrain) {
                    const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.4;
                    const siphonX = this.x + Math.cos(angle) * (this.radius * 0.95);
                    const siphonY = this.y + Math.sin(angle) * (this.radius * 0.95);
                    const spd = 110 + Math.random() * 140;

                    if (game.particles && typeof game.particles.spawnOrbitalGrain === 'function') {
                        game.particles.spawnOrbitalGrain(
                            siphonX, siphonY,
                            this.vx + Math.cos(angle) * spd,
                            this.vy + Math.sin(angle) * spd,
                            this.color1 || '#ffaa00',
                            this.type === 'lava' ? MAT.LAVA : (this.type === 'ice' ? MAT.ICE : MAT.DIRT),
                            null // Free floating
                        );
                    }
                }
            }
        }
    }

    /**
     * Shatter planet completely and disperse all remaining materials across space as free-floating grains
     */
    shatter(game) {
        if (this.isDead) return;
        this.isDead = true;

        if (game) {
            sound.playExplosion(2.4);
            game.triggerScreenShake(30, 0.7);
            game.particles.createExplosion(this.x, this.y, this.color1 || '#ff8800', 80, 160);
            game.particles.createFloatingText(this.x, this.y, `${this.name.toUpperCase()} SHATTERED!`, '#ff3344', 24);

            if (this.terrain) {
                this.terrain.disperseRemainingMaterial(game);
            }
        }
    }

    getEffectiveRadiusAtAngle(angle) {
        if (this.terrain) {
            return this.terrain.getSurfaceRadiusAtAngle(angle);
        }
        return Math.max(20, this.radius);
    }

    addCrater(impactX, impactY, blastRadius, options = {}, game = null) {
        if (this.isBlackHole || this.isStar) return;

        const opts = typeof options === 'boolean' ? { isMagma: options } : (options || {});

        // Blast and deform granular sand simulation without core restrictions
        if (this.terrain) {
            this.terrain.carveExplosion(impactX, impactY, blastRadius, opts, game);
        }

        // Volumetric radius adjustment
        const vaporizeRatio = opts.vaporizeRatio !== undefined ? opts.vaporizeRatio : 0.65;
        this.targetRadius = Math.max(25, this.targetRadius - blastRadius * 0.08 * vaporizeRatio);
    }

    modifySize(factor) {
        this.targetRadius = Math.max(35, Math.min(420, this.radius * factor));
        if (this.terrain) {
            this.terrain.radius = this.targetRadius;
            this.terrain.updateSurfaceCache();
            this.terrain.recomputeMassDistribution();
        }
    }

    turnIntoRepulsor() {
        this.isRepulsor = true;
        this.isBlackHole = false;
        this.type = 'crystal';
        this.targetMass = -Math.abs(this.mass) * 1.6;
        this.atmosphereColor = 'rgba(0, 255, 255, 0.5)';
        this.glowColor = 'rgba(0, 230, 255, 0.8)';
    }

    getSurfacePos(angle, offset = 0) {
        const r = this.getEffectiveRadiusAtAngle(angle) + offset;
        return {
            x: this.x + Math.cos(angle) * r,
            y: this.y + Math.sin(angle) * r
        };
    }

    drawGravityField(ctx) {
        if (Math.abs(this.mass) < 5) return;
        ctx.save();
        const cm = this.getCenterOfMass();
        const numRings = 3;
        const isNegative = this.mass < 0 || this.isRepulsor;
        const baseColor = isNegative ? '0, 230, 255' : (this.isStar ? '255, 170, 0' : '100, 180, 255');

        for (let i = 1; i <= numRings; i++) {
            const waveOffset = ((this.pulsePhase * (isNegative ? 1 : -1) + i * (Math.PI * 2 / numRings)) % (Math.PI * 2));
            const norm = (Math.sin(waveOffset) + 1) / 2;
            const ringRadius = this.radius + 30 + norm * (this.gravityRadius * 0.3);
            const alpha = (1 - norm) * 0.16;

            ctx.beginPath();
            ctx.arc(cm.x, cm.y, ringRadius, 0, Math.PI * 2);
            ctx.lineWidth = 1.8;
            ctx.setLineDash([8, 10]);
            ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
            ctx.stroke();
        }
        ctx.restore();
    }

    drawOrbitalTrail(ctx) {
        if (!this.orbitalTrail || this.orbitalTrail.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.orbitalTrail[0].x, this.orbitalTrail[0].y);
        for (let i = 1; i < this.orbitalTrail.length; i++) {
            ctx.lineTo(this.orbitalTrail[i].x, this.orbitalTrail[i].y);
        }
        ctx.lineWidth = 2.0;
        ctx.strokeStyle = this.isRepulsor ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.14)';
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.restore();
    }

    draw(ctx) {
        this.drawOrbitalTrail(ctx);

        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.isStar) {
            const pulse = Math.sin(this.pulsePhase * 3) * 8;
            const corona = ctx.createRadialGradient(0, 0, this.radius * 0.6, 0, 0, this.radius + 50 + pulse);
            corona.addColorStop(0, '#ffffff');
            corona.addColorStop(0.3, '#ffcc00');
            corona.addColorStop(0.7, '#ff4400');
            corona.addColorStop(1, 'transparent');

            ctx.fillStyle = corona;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 55 + pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffeedd';
            ctx.shadowColor = '#ffaa00';
            ctx.shadowBlur = 32;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
            return;
        }

        // Atmosphere Glow
        const atmoGrad = ctx.createRadialGradient(0, 0, this.radius * 0.9, 0, 0, this.radius * 1.35);
        atmoGrad.addColorStop(0, this.atmosphereColor);
        atmoGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = atmoGrad;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 1.35, 0, Math.PI * 2);
        ctx.fill();

        // Render Sand / Pixel Terrain Canvas
        if (this.terrain) {
            this.terrain.draw(ctx);
        } else {
            ctx.fillStyle = this.color1;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Subtle atmospheric specular rim
        const lightAngle = -Math.PI / 4;
        const lx = Math.cos(lightAngle) * this.radius * 0.4;
        const ly = Math.sin(lightAngle) * this.radius * 0.4;
        const rimGrad = ctx.createRadialGradient(lx, ly, this.radius * 0.2, 0, 0, this.radius);
        rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        rimGrad.addColorStop(0.7, 'transparent');
        rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Planet Rings if enabled
        if (this.hasRings) {
            ctx.rotate(0.35);
            ctx.lineWidth = 14;
            ctx.strokeStyle = this.ringColor;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.radius * 2.0, this.radius * 0.48, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }
}
