// Pure Radial Falling Sand & Planetary Cosmic Simulation Engine
import { RadialSandEngine, MAT } from './sand_engine.js';
import { WebGLRenderer } from './webgl_renderer.js';
import { IncrementalEngine } from './incremental.js';
import { sound } from './audio.js';

export class GravityGame {
    constructor(canvas, uiCallbacks = {}) {
        this.canvas = canvas;
        this.ui = uiCallbacks;

        // Initialize GPU WebGL2 Hardware-Accelerated Renderer (with 2D Canvas fallback)
        this.renderer = new WebGLRenderer(canvas);
        this.ctx = (!this.renderer || !this.renderer.isSupported) ? canvas.getContext('2d') : null;

        // Visual Projectiles & FX Overlay Canvas
        this.fxCanvas = document.getElementById('fxCanvas');
        this.fxCtx = this.fxCanvas ? this.fxCanvas.getContext('2d') : null;

        // Sand Engine (2048x2048 planetary simulation grid with scale 4.0 = 8200px cosmic universe)
        this.sandEngine = new RadialSandEngine(2048, 2048, 4.0);
        this.sandEngine.game = this;

        // Incremental & Idle Destruction Engine
        this.incrementalEngine = new IncrementalEngine(this);

        // Camera & Viewport
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            zoom: 0.30,
            userZoom: 0.30,
            targetZoom: 0.30,
            isPanning: false,
            panStartX: 0,
            panStartY: 0,
            panOriginX: 0,
            panOriginY: 0,
            shakeAmount: 0,
            shakeDuration: 0
        };

        // Sandbox Controls
        this.sandboxTool = 'spray_sand';
        this.brushSize = 14;
        this.isMouseDown = false;
        this.mousePos = { x: 0, y: 0 };
        this.keys = {};
        this.heatMapMode = false;

        // Performance timing
        this.lastTime = performance.now();
        this.fps = 60;
        this.frameCount = 0;
        this.fpsLastCheck = performance.now();

        // Generate massive initial planetary world
        this.resetPlanet();
    }

    resetPlanet() {
        if (this.incrementalEngine) {
            this.incrementalEngine.spawnNewPlanet(this.incrementalEngine.currentTier);
        } else {
            this.sandEngine.generateStarterPlanet(580);
        }
    }

    chaosPlanet() {
        this.sandEngine.generateChaosPlanet(580);
    }

    triggerScreenShake(amount, duration) {
        this.camera.shakeAmount = Math.max(this.camera.shakeAmount, amount);
        this.camera.shakeDuration = Math.max(this.camera.shakeDuration, duration);
    }

    screenToWorld(sx, sy) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        return {
            x: (sx - cx) / this.camera.zoom + this.camera.x,
            y: (sy - cy) / this.camera.zoom + this.camera.y
        };
    }

    worldToScreen(wx, wy) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        return {
            x: (wx - this.camera.x) * this.camera.zoom + cx,
            y: (wy - this.camera.y) * this.camera.zoom + cy
        };
    }

    getMiningRadiusWorld() {
        const clickLvl = this.incrementalEngine?.upgrades?.clickPower?.level || 0;
        const scale = this.sandEngine ? this.sandEngine.scale : 4.0;
        return (1.0 + clickLvl * 0.45) * scale;
    }

    handleSandboxPaint(worldX, worldY) {
        const miningRadius = this.getMiningRadiusWorld();
        const minedGrains = this.sandEngine.mineAtWorld(worldX, worldY, miningRadius);
        if (minedGrains > 0) {
            if (Math.random() < 0.35) {
                sound.playShoot('energy');
            }
        }
    }

    update(dt) {
        // Smooth Camera Navigation
        this.camera.x += (this.camera.targetX - this.camera.x) * Math.min(1.0, dt * 10);
        this.camera.y += (this.camera.targetY - this.camera.y) * Math.min(1.0, dt * 10);
        this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * Math.min(1.0, dt * 12);

        // Screen shake decay
        if (this.camera.shakeDuration > 0) {
            this.camera.shakeDuration -= dt;
            if (this.camera.shakeDuration <= 0) {
                this.camera.shakeAmount = 0;
            }
        }

        // Update Physics & Falling Sand Cellular Automata
        this.sandEngine.update(dt);

        // Update Incremental Progression & Autonomous Weapons
        if (this.incrementalEngine) {
            this.incrementalEngine.update(dt);
        }
    }

    drawCosmicBackground(ctx, width, height) {
        // Radial Gravitational Singularity Grid (Space-Time Warping Web)
        ctx.save();
        const maxR = Math.max(width, height) * 1.2;

        for (let r = 80; r < maxR; r += 70) {
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.lineWidth = 1.0;
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
            ctx.stroke();
        }

        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * maxR, Math.sin(a) * maxR);
            ctx.lineWidth = 1.0;
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
            ctx.stroke();
        }

        // Center Gravity Singularity Core Glow
        const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 60);
        glow.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
        glow.addColorStop(0.5, 'rgba(181, 43, 255, 0.12)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 60, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    render() {
        // Fast-path: Hardware-accelerated GPU WebGL2 rendering
        if (this.renderer && this.renderer.isSupported) {
            this.renderer.render(this, this.sandEngine);
        } else {
            // 2D Canvas Fallback path
            const ctx = this.ctx;
            if (ctx) {
                const width = this.canvas.width;
                const height = this.canvas.height;

                // 1. Clear background
                ctx.fillStyle = '#050711';
                ctx.fillRect(0, 0, width, height);

                // Apply screen shake
                let shakeX = 0;
                let shakeY = 0;
                if (this.camera.shakeAmount > 0) {
                    shakeX = (Math.random() - 0.5) * this.camera.shakeAmount * 2;
                    shakeY = (Math.random() - 0.5) * this.camera.shakeAmount * 2;
                }

                // Camera transform centered at screen
                ctx.save();
                ctx.translate(width / 2 + shakeX, height / 2 + shakeY);
                ctx.scale(this.camera.zoom, this.camera.zoom);
                ctx.translate(-this.camera.x, -this.camera.y);

                // 2. Draw Space-Time Grid & Central Singularity
                this.drawCosmicBackground(ctx, width, height);

                // 3. Draw Radial Falling Sand Planetary Simulation
                this.sandEngine.draw(ctx);

                ctx.restore();
            }
        }

        // Draw distinct visual weapon projectiles, lasers, and stardust loot on transparent FX overlay
        if (this.fxCtx && this.incrementalEngine) {
            this.incrementalEngine.draw(this.fxCtx, this.camera, this.canvas.width, this.canvas.height);
        }
    }

    startLoop() {
        this.fps = 60;
        this.frameCount = 0;
        this.fpsLastCheck = performance.now();

        const loop = (currentTime) => {
            const dt = Math.min(0.06, (currentTime - this.lastTime) * 0.001);
            this.lastTime = currentTime;

            this.frameCount++;
            if (currentTime - this.fpsLastCheck >= 350) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.fpsLastCheck));
                this.frameCount = 0;
                this.fpsLastCheck = currentTime;
                if (this.ui && this.ui.onFpsUpdate) {
                    this.ui.onFpsUpdate(this.fps);
                }
            }

            this.update(dt);
            this.render();

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}
