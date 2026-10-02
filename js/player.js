// Player / Tank Entity with Radial Surface Physics and Central Gravity
import { sound } from './audio.js';

export class Player {
    constructor(config) {
        this.id = config.id || ('pl_' + Math.random().toString(36).substr(2, 9));
        this.name = config.name || 'Worm Commander';
        this.color = config.color || '#00f0ff';
        this.isAI = config.isAI || false;
        this.team = config.team || 1;

        // Polar Surface Coordinates (Relative to center (0, 0))
        this.angle = config.angle !== undefined ? config.angle : -Math.PI / 2;
        this.radius = config.radius || 130;
        this.size = 12;

        // Cartesian Position & Dynamics
        this.x = Math.cos(this.angle) * this.radius;
        this.y = Math.sin(this.angle) * this.radius;
        this.vx = 0;
        this.vy = 0;

        // Grounding & Movement
        this.isGrounded = true;
        this.facing = 1; // 1 = clockwise, -1 = counter-clockwise
        this.walkSpeed = 65; // px/sec along surface

        // Stats
        this.hp = 100;
        this.maxHp = 100;
        this.fuel = 100;
        this.maxFuel = 100;
        this.isDead = false;

        // Aiming
        this.aimAngle = 0.45; // Radians relative to surface normal
        this.aimPower = 55; // [10..100]
        this.currentWeaponIndex = 0;
        this.ammoInventory = {};

        // Animation
        this.animPhase = 0;
    }

    getWorldPos() {
        return { x: this.x, y: this.y };
    }

    getSurfaceNormal() {
        return Math.atan2(this.y, this.x);
    }

    getAbsoluteAimAngle() {
        const normal = this.getSurfaceNormal();
        return normal + this.aimAngle * this.facing;
    }

    walk(direction, dt, sandEngine) {
        if (!this.isGrounded || this.isDead) return;
        this.facing = direction;

        const surfaceR = sandEngine ? sandEngine.getSurfaceRadiusAtAngle(this.angle) : this.radius;
        const angularSpeed = (this.walkSpeed * direction) / Math.max(30, surfaceR);
        this.angle += angularSpeed * dt;

        this.animPhase += dt * 12;
    }

    jump() {
        if (!this.isGrounded || this.isDead) return;
        this.isGrounded = false;
        sound.playJump();

        const normal = this.getSurfaceNormal();
        const tangent = normal + Math.PI / 2;
        const jumpSpeed = 160;

        this.vx = Math.cos(normal) * jumpSpeed + Math.cos(tangent) * (this.facing * 35);
        this.vy = Math.sin(normal) * jumpSpeed + Math.sin(tangent) * (this.facing * 35);
    }

    useJetpack(jx, jy, dt) {
        if (this.fuel <= 0 || this.isDead) return;
        this.isGrounded = false;
        const fuelCost = 35 * dt;
        this.fuel = Math.max(0, this.fuel - fuelCost);

        const thrust = 340;
        this.vx += jx * thrust * dt;
        this.vy += jy * thrust * dt;

        sound.playJetpack();
    }

    takeDamage(amount, sourceX = 0, sourceY = 0) {
        if (this.isDead) return;
        this.hp = Math.max(0, this.hp - amount);
        sound.playHit();

        // Blast knockback
        const dx = this.x - sourceX;
        const dy = this.y - sourceY;
        const dist = Math.hypot(dx, dy) || 1;
        const knockback = Math.min(240, amount * 4.0);

        this.isGrounded = false;
        this.vx += (dx / dist) * knockback;
        this.vy += (dy / dist) * knockback;

        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
            sound.playExplosion(1.5);
        }
    }

    update(dt, sandEngine) {
        if (this.isDead) return;

        if (this.isGrounded) {
            // Snapped smoothly to current radial surface elevation
            const targetR = sandEngine.getSurfaceRadiusAtAngle(this.angle) + this.size * 0.7;
            this.radius += (targetR - this.radius) * 14.0 * dt;

            this.x = Math.cos(this.angle) * this.radius;
            this.y = Math.sin(this.angle) * this.radius;
            this.vx = 0;
            this.vy = 0;
        } else {
            // Free flight: Accelerated by central point gravity (0, 0)
            const G = sandEngine.gravityConstant;
            const soft = 1200;
            const distSq = this.x * this.x + this.y * this.y;
            const dist = Math.sqrt(distSq);

            const force = (G * sandEngine.gravityStrength) / (distSq + soft);
            const gravDir = sandEngine.gravityInverted ? -1 : 1;

            this.vx += (-this.x / (dist || 1)) * force * gravDir * dt;
            this.vy += (-this.y / (dist || 1)) * force * gravDir * dt;

            this.x += this.vx * dt;
            this.y += this.vy * dt;

            this.angle = Math.atan2(this.y, this.x);
            this.radius = dist;

            // Check surface landing
            const surfaceR = sandEngine.getSurfaceRadiusAtAngle(this.angle);
            if (this.radius <= surfaceR + this.size * 0.8) {
                this.isGrounded = true;
                this.radius = surfaceR + this.size * 0.7;
                this.x = Math.cos(this.angle) * this.radius;
                this.y = Math.sin(this.angle) * this.radius;
            }
        }
    }

    draw(ctx, isCurrentTurn = false) {
        if (this.isDead) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Rotate so player's feet point toward planet center, head points outward
        const normal = this.getSurfaceNormal();
        ctx.rotate(normal + Math.PI / 2);

        // Turn indicator beacon
        if (isCurrentTurn) {
            const bob = Math.sin(Date.now() * 0.008) * 4;
            ctx.fillStyle = '#ffe600';
            ctx.beginPath();
            ctx.moveTo(0, -this.size - 16 + bob);
            ctx.lineTo(-6, -this.size - 26 + bob);
            ctx.lineTo(6, -this.size - 26 + bob);
            ctx.closePath();
            ctx.fill();
        }

        // Tank Tread / Base
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.roundRect(-this.size, -this.size * 0.5, this.size * 2, this.size, 4);
        ctx.fill();
        ctx.stroke();

        // Tank Turret Dome
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, -this.size * 0.5, this.size * 0.65, Math.PI, 0);
        ctx.fill();

        // Aiming Cannon Barrel
        const localAim = this.aimAngle * this.facing;
        const barrelLen = this.size * 1.5;
        const barrelX = Math.sin(localAim) * barrelLen;
        const barrelY = -this.size * 0.5 - Math.cos(localAim) * barrelLen;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.5);
        ctx.lineTo(barrelX, barrelY);
        ctx.stroke();

        // Name & Health Bar Tag above player
        ctx.rotate(-(normal + Math.PI / 2)); // Un-rotate for crisp readable text
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(this.name, 0, -this.size - 18);

        // Health Mini Bar
        const barW = 28;
        const barH = 4;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(-barW / 2, -this.size - 12, barW, barH);
        ctx.fillStyle = this.hp > 50 ? '#39ff14' : (this.hp > 25 ? '#ffe600' : '#ff0055');
        ctx.fillRect(-barW / 2, -this.size - 12, barW * (this.hp / this.maxHp), barH);

        ctx.restore();
    }
}
