// Particle & Visual Effects Engine for Gravity Wars

export class Particle {
    constructor(x, y, vx, vy, color, size, maxLife, type = 'normal', data = {}) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.maxLife = maxLife;
        this.life = maxLife;
        this.type = type; // 'normal', 'smoke', 'spark', 'gravity-wave', 'crystal', 'debris', 'text'
        this.data = data;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.2;
    }

    update(dt, planets = []) {
        this.life -= dt;
        this.rotation += this.vRot;

        // Apply multi-body gravitational physics to orbital grains and debris
        if (this.type === 'grain' || this.type === 'debris' || this.type === 'spark') {
            for (const p of planets) {
                if (p.isDead) continue;
                const dx = p.x - this.x;
                const dy = p.y - this.y;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                if (typeof p.getGravitationalPullAt === 'function') {
                    const pull = p.getGravitationalPullAt(this.x, this.y, 0.85);
                    this.vx += pull.fx * dt;
                    this.vy += pull.fy * dt;
                } else if (dist < p.gravityRadius && dist > 2) {
                    const force = (p.mass * 32000) / (distSq + 600);
                    this.vx += (dx / dist) * force * dt;
                    this.vy += (dy / dist) * force * dt;
                }

                // Accretion / Impact onto another planet!
                if (this.type === 'grain' && p !== this.data.sourcePlanet) {
                    const angle = Math.atan2(this.y - p.y, this.x - p.x);
                    const surfaceR = p.getEffectiveRadiusAtAngle(angle);
                    if (dist <= surfaceR + 4) {
                        if (p.terrain) {
                            p.terrain.sprayMaterial(this.x, this.y, this.data.mat || 3, 2);
                        }
                        this.life = 0; // Accreted
                        return false;
                    }
                }
            }
            this.vx *= 0.997;
            this.vy *= 0.997;
        }

        if (this.type === 'smoke') {
            this.vx *= 0.95;
            this.vy *= 0.95;
            this.size += dt * 8;
        } else if (this.type === 'gravity-wave') {
            this.size += dt * (this.data.expandSpeed || 150);
        } else if (this.type === 'text') {
            this.y -= dt * 25;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        return this.life > 0;
    }

    draw(ctx) {
        const progress = Math.max(0, this.life / this.maxLife);
        ctx.save();

        if (this.type === 'text') {
            ctx.globalAlpha = Math.min(1, progress * 1.5);
            ctx.font = `bold ${this.size}px 'Outfit', sans-serif`;
            ctx.fillStyle = this.color;
            ctx.textAlign = 'center';
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.fillText(this.data.text || '', this.x, this.y);
            ctx.restore();
            return;
        }

        if (this.type === 'gravity-wave') {
            ctx.globalAlpha = progress * 0.7;
            ctx.lineWidth = 3 * progress;
            ctx.strokeStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
            return;
        }

        ctx.globalAlpha = progress;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.type === 'smoke') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'crystal') {
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size * 0.6, 0);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size * 0.6, 0);
            ctx.closePath();
            ctx.fill();
        } else {
            // Spark / normal debris
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 6;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        ctx.restore();
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.stars = [];
        this.initStars(150, 4000, 4000);
    }

    initStars(count, width, height) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                radius: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 2 + 1,
                color: ['#ffffff', '#aee5ff', '#ffddaa', '#e4aaff', '#99f6ff'][Math.floor(Math.random() * 5)]
            });
        }
    }

    update(dt, planets = []) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (!this.particles[i].update(dt, planets)) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        for (const p of this.particles) {
            p.draw(ctx);
        }
    }

    drawStars(ctx, camera) {
        const time = performance.now() * 0.001;
        ctx.save();
        for (const star of this.stars) {
            // Parallax shift
            const px = star.x - camera.x * 0.15;
            const py = star.y - camera.y * 0.15;
            const flicker = Math.sin(time * star.twinkleSpeed + star.x) * 0.3 + 0.7;

            ctx.globalAlpha = star.alpha * flicker;
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(px, py, star.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    createExplosion(x, y, color = '#ff8822', count = 50, maxRadius = 110) {
        // Multi-layer shockwave rings
        this.particles.push(new Particle(x, y, 0, 0, color, 6, 0.45, 'gravity-wave', { expandSpeed: maxRadius * 3.8 }));
        this.particles.push(new Particle(x, y, 0, 0, '#ffffff', 3, 0.3, 'gravity-wave', { expandSpeed: maxRadius * 2.8 }));
        this.particles.push(new Particle(x, y, 0, 0, '#ffcc00', 8, 0.55, 'gravity-wave', { expandSpeed: maxRadius * 1.8 }));

        // Fire & Debris sparks
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 320 + 60;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const colors = [color, '#ffdd44', '#ffffff', '#ff3311', '#ff9900'];
            const pColor = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 8 + 3;
            const life = Math.random() * 0.75 + 0.35;
            this.particles.push(new Particle(x, y, vx, vy, pColor, size, life, 'debris'));
        }

        // Smoke clouds
        for (let i = 0; i < count * 0.5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 70 + 15;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = Math.random() * 0.9 + 0.6;
            this.particles.push(new Particle(x, y, vx, vy, 'rgba(80, 70, 90, 0.45)', 10, life, 'smoke'));
        }
    }

    createSingularityImplosion(x, y, color = '#aa33ff') {
        // Inward collapsing particles & inverse shockwaves
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 120 + 50;
            const speed = dist * 2.2;
            const sx = x + Math.cos(angle) * dist;
            const sy = y + Math.sin(angle) * dist;
            const vx = -Math.cos(angle) * speed;
            const vy = -Math.sin(angle) * speed;
            this.particles.push(new Particle(sx, sy, vx, vy, color, 4, 0.5, 'spark'));
        }
        this.particles.push(new Particle(x, y, 0, 0, '#cc44ff', 120, 0.6, 'gravity-wave', { expandSpeed: -160 }));
    }

    createTerraformBurst(x, y, color = '#22ffaa') {
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 140 + 30;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            this.particles.push(new Particle(x, y, vx, vy, color, Math.random() * 6 + 3, Math.random() * 0.8 + 0.4, 'crystal'));
        }
        this.particles.push(new Particle(x, y, 0, 0, color, 10, 0.5, 'gravity-wave', { expandSpeed: 200 }));
    }

    createRepulsorWave(x, y) {
        this.particles.push(new Particle(x, y, 0, 0, '#00e5ff', 5, 0.6, 'gravity-wave', { expandSpeed: 380 }));
        this.particles.push(new Particle(x, y, 0, 0, '#76ffff', 5, 0.4, 'gravity-wave', { expandSpeed: 260 }));
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 250 + 150;
            this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, '#00ffff', 4, 0.4, 'spark'));
        }
    }

    createFloatingText(x, y, text, color = '#ffff00', size = 18) {
        this.particles.push(new Particle(x, y, 0, -20, color, size, 1.2, 'text', { text }));
    }

    createTrail(x, y, color = '#ff9900', size = 4) {
        this.particles.push(new Particle(x, y, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, color, size, 0.35, 'spark'));
    }

    spawnOrbitalGrain(x, y, vx, vy, color, mat = 3, sourcePlanet = null) {
        // High capacity particle pool for chaotic orbital debris
        if (this.particles.length > 900) return;
        this.particles.push(new Particle(x, y, vx, vy, color, 3.2, 10.0, 'grain', { mat, sourcePlanet }));
    }
}

// Guarantee prototype availability
ParticleSystem.prototype.spawnOrbitalGrain = function(x, y, vx, vy, color, mat = 3, sourcePlanet = null) {
    if (this.particles.length > 900) return;
    this.particles.push(new Particle(x, y, vx, vy, color, 3.2, 10.0, 'grain', { mat, sourcePlanet }));
};
