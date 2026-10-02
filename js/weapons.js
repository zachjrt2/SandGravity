// Weapon Definitions and Radial Central Gravity Projectile Physics
import { sound } from './audio.js';
import { MAT } from './sand_engine.js';

export const WEAPON_REGISTRY = [
    {
        id: 'missile',
        name: 'Kinetic Shell',
        desc: 'Standard ballistic shell with medium blast crater and voxel ejecta.',
        blastRadius: 26,
        damage: 45,
        type: 'explosive',
        ammo: Infinity,
        iconColor: '#00f0ff',
        pushPower: 1.2
    },
    {
        id: 'nuke',
        name: 'Solar Nuke',
        desc: 'Massive thermonuclear blast that vaporizes rock and launches heavy orbital debris clouds.',
        blastRadius: 52,
        damage: 90,
        type: 'nuke',
        ammo: 2,
        iconColor: '#ff0055',
        pushPower: 2.2
    },
    {
        id: 'magma',
        name: 'Magma Meteor',
        desc: 'Impacts and floods the blast crater with incandescent, flowing molten lava.',
        blastRadius: 32,
        damage: 55,
        type: 'magma',
        ammo: 4,
        iconColor: '#ff5500',
        pushPower: 1.0,
        injectMat: MAT.LAVA,
        injectRadius: 9
    },
    {
        id: 'torrent',
        name: 'Water Deluge',
        desc: 'Releases a pressurized reservoir of water, creating rivers, oceans, and cooling lava.',
        blastRadius: 22,
        damage: 25,
        type: 'water',
        ammo: 4,
        iconColor: '#00bfff',
        pushPower: 0.8,
        injectMat: MAT.WATER,
        injectRadius: 12
    },
    {
        id: 'acid',
        name: 'Acid Sprayer',
        desc: 'Corrosive chemical warhead that melts tunnels and deep caverns through solid stone.',
        blastRadius: 28,
        damage: 60,
        type: 'acid',
        ammo: 3,
        iconColor: '#39ff14',
        pushPower: 0.6,
        injectMat: MAT.ACID,
        injectRadius: 10
    },
    {
        id: 'sand_cannon',
        name: 'Sand Avalanche',
        desc: 'Launches a high-volume payload of granular sand into orbit, creating new mountains.',
        blastRadius: 15,
        damage: 20,
        type: 'sand',
        ammo: 5,
        iconColor: '#ffe600',
        pushPower: 0.5,
        injectMat: MAT.SAND,
        injectRadius: 14
    },
    {
        id: 'cluster',
        name: 'Cluster Warhead',
        desc: 'Splits in mid-flight into 4 kinetic submunitions that blanket the area.',
        blastRadius: 20,
        damage: 35,
        type: 'cluster',
        ammo: 3,
        iconColor: '#b52bff',
        pushPower: 1.1
    },
    {
        id: 'digger',
        name: 'Core Drill',
        desc: 'Drills deep tunnels through the planet towards the center before exploding.',
        blastRadius: 30,
        damage: 65,
        type: 'digger',
        ammo: 3,
        iconColor: '#ffaa00',
        pushPower: 1.4
    },
    {
        id: 'antigrav',
        name: 'Gravitite Bomb',
        desc: 'Inverts local gravity and blasts anti-gravity matter that ascends into outer space.',
        blastRadius: 36,
        damage: 40,
        type: 'antigrav',
        ammo: 3,
        iconColor: '#fa50da',
        pushPower: 1.8,
        injectMat: MAT.GRAVITITE,
        injectRadius: 8
    },
    {
        id: 'seed',
        name: 'Terraform Seed',
        desc: 'Sprouts organic floral roots and trees that grow outwards across the sand.',
        blastRadius: 12,
        damage: 10,
        type: 'seed',
        ammo: 4,
        iconColor: '#20e040',
        pushPower: 0.2,
        injectMat: MAT.FLORA,
        injectRadius: 11
    },
    {
        id: 'railgun',
        name: 'Orbital Railgun',
        desc: 'High-speed hyper-velocity slug piercing directly through terrain with minimal curve.',
        blastRadius: 22,
        damage: 70,
        type: 'railgun',
        ammo: 2,
        iconColor: '#ffffff',
        pushPower: 1.6
    }
];

export class Projectile {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.vx = config.vx || 0;
        this.vy = config.vy || 0;
        this.weapon = config.weapon || WEAPON_REGISTRY[0];
        this.owner = config.owner || null;
        this.radius = config.radius || (this.weapon.id === 'nuke' ? 5 : 3.5);
        this.life = config.life || 12.0;
        this.isDead = false;
        this.trail = [];
        this.isSplit = config.isSplit || false;
        this.splitTimer = config.weapon && config.weapon.type === 'cluster' && !this.isSplit ? 0.9 : -1;
    }

    update(dt, sandEngine, game) {
        this.life -= dt;
        if (this.life <= 0) {
            this.explode(sandEngine, game);
            return;
        }

        // Mid-air Cluster Split
        if (this.splitTimer > 0) {
            this.splitTimer -= dt;
            if (this.splitTimer <= 0) {
                this.splitIntoClusters(sandEngine, game);
                return;
            }
        }

        // Single Central Point Gravity: pulls toward (0, 0) in world coordinates
        const G = sandEngine.gravityConstant;
        const soft = 1200;
        const dx = -this.x;
        const dy = -this.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        const gravMult = this.weapon.type === 'railgun' ? 0.25 : 1.0;
        const force = (G * sandEngine.gravityStrength * gravMult) / (distSq + soft);
        const gravDir = sandEngine.gravityInverted ? -1 : 1;

        this.vx += (dx / (dist || 1)) * force * gravDir * dt;
        this.vy += (dy / (dist || 1)) * force * gravDir * dt;

        // Substep integration for continuous collision detection against sand cells
        const steps = 3;
        const subDt = dt / steps;

        for (let s = 0; s < steps; s++) {
            this.x += this.vx * subDt;
            this.y += this.vy * subDt;

            // Trail
            if (s === 0) {
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 20) this.trail.shift();
            }

            // Digger Drill logic: tunnels through terrain before detonating
            if (this.weapon.type === 'digger' && sandEngine.isSolidAtWorld(this.x, this.y)) {
                sandEngine.paintWorld(this.x, this.y, 6, MAT.AIR);
                this.vx *= 0.94;
                this.vy *= 0.94;
                if (Math.hypot(this.vx, this.vy) < 20 || Math.hypot(this.x, this.y) < 20) {
                    this.explode(sandEngine, game);
                    return;
                }
                continue;
            }

            // Standard collision with radial sand terrain
            if (sandEngine.isSolidAtWorld(this.x, this.y)) {
                this.explode(sandEngine, game);
                return;
            }

            // Check collision with players
            if (game && game.players) {
                for (const player of game.players) {
                    if (player.isDead) continue;
                    const pPos = player.getWorldPos();
                    const pDist = Math.hypot(this.x - pPos.x, this.y - pPos.y);
                    if (pDist < player.size + this.radius) {
                        this.explode(sandEngine, game);
                        return;
                    }
                }
            }
        }
    }

    splitIntoClusters(sandEngine, game) {
        this.isDead = true;
        sound.playShoot('warp');
        if (!game || !game.projectiles) return;

        const count = 4;
        for (let i = 0; i < count; i++) {
            const spreadAngle = (i - (count - 1) / 2) * 0.28;
            const curSpd = Math.hypot(this.vx, this.vy);
            const curAngle = Math.atan2(this.vy, this.vx) + spreadAngle;

            game.projectiles.push(new Projectile({
                x: this.x,
                y: this.y,
                vx: Math.cos(curAngle) * curSpd * (0.9 + Math.random() * 0.2),
                vy: Math.sin(curAngle) * curSpd * (0.9 + Math.random() * 0.2),
                weapon: {
                    ...this.weapon,
                    blastRadius: 18,
                    damage: 28,
                    type: 'explosive'
                },
                owner: this.owner,
                isSplit: true
            }));
        }
    }

    explode(sandEngine, game) {
        if (this.isDead) return;
        this.isDead = true;

        const blastR = this.weapon.blastRadius;
        const pushP = this.weapon.pushPower || 1.0;
        const isMagma = this.weapon.type === 'magma';

        // 1. Carve Crater & Disperse Voxels into Orbit
        sandEngine.carveExplosion(this.x, this.y, blastR, {
            isMagma: isMagma,
            pushPower: pushP,
            vaporizeRatio: this.weapon.type === 'nuke' ? 0.75 : 0.55
        });

        // 2. Inject specific material (Water, Lava, Acid, Sand, Gravitite, Flora)
        if (this.weapon.injectMat !== undefined && this.weapon.injectRadius) {
            sandEngine.paintWorld(this.x, this.y, this.weapon.injectRadius * sandEngine.scale, this.weapon.injectMat);
        }

        // 3. Audio & Visual Feedback
        if (this.weapon.type === 'nuke') {
            sound.playExplosion(2.5, true);
            if (game) game.triggerScreenShake(30, 0.8);
        } else if (this.weapon.type === 'water') {
            sound.playShoot('terraform');
            if (game) game.triggerScreenShake(8, 0.3);
        } else if (this.weapon.type === 'acid') {
            sound.playExplosion(1.4);
            if (game) game.triggerScreenShake(12, 0.4);
        } else {
            sound.playExplosion(1.6);
            if (game) game.triggerScreenShake(15, 0.5);
        }

        // 4. Damage Players in Blast Radius
        if (game && game.players) {
            for (const player of game.players) {
                if (player.isDead) continue;
                const pPos = player.getWorldPos();
                const dist = Math.hypot(this.x - pPos.x, this.y - pPos.y);

                if (dist < blastR * 1.6) {
                    const dmgFactor = Math.max(0.2, 1 - dist / (blastR * 1.6));
                    const dmg = Math.round(this.weapon.damage * dmgFactor);
                    player.takeDamage(dmg, this.x, this.y);
                }
            }
        }
    }

    draw(ctx) {
        ctx.save();

        // Draw trail
        if (this.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.strokeStyle = this.weapon.iconColor || '#00f0ff';
            ctx.lineWidth = 2.0;
            ctx.globalAlpha = 0.4;
            ctx.stroke();
        }

        // Draw projectile body & glow
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = this.weapon.iconColor || '#00f0ff';
        ctx.shadowColor = this.weapon.iconColor || '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
