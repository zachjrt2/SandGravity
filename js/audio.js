// Web Audio API Procedural Sound Effects Engine for Gravity Wars
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.4;
        this.bgmNode = null;
        this.initOnFirstGesture();
    }

    initOnFirstGesture() {
        const unlock = () => {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };
        window.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
    }

    ensureContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    }

    playShoot(type = 'default') {
        if (!this.enabled || !this.ensureContext()) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        if (type === 'blackhole' || type === 'singularity') {
            // Low frequency sub rumble with rising harmonic
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, now);
            filter.frequency.linearRampToValueAtTime(800, now + 0.3);
            filter.frequency.exponentialRampToValueAtTime(50, now + 0.7);

            gain.gain.setValueAtTime(this.volume * 0.8, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.7);
        } else if (type === 'repulsor' || type === 'warp') {
            // Space warp whoosh
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.5);

            gain.gain.setValueAtTime(this.volume * 0.7, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'terraform' || type === 'grow') {
            // Harmonious crystalline growth chime
            [440, 554.37, 659.25, 880].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.05);

                gain.gain.setValueAtTime(0, now + i * 0.05);
                gain.gain.linearRampToValueAtTime(this.volume * 0.4, now + i * 0.05 + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.4);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.05);
                osc.stop(now + i * 0.05 + 0.45);
            });
        } else if (type === 'laser') {
            // Futuristic pew
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);

            gain.gain.setValueAtTime(this.volume * 0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.22);
        } else {
            // Standard missile launch
            const osc = ctx.createOscillator();
            const noise = this.createNoiseBuffer(ctx, 0.3);
            const noiseNode = ctx.createBufferSource();
            noiseNode.buffer = noise;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(600, now);
            noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 0.3);

            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);

            gain.gain.setValueAtTime(this.volume * 0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(gain);
            noiseNode.connect(noiseFilter);
            noiseFilter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            noiseNode.start(now);
            osc.stop(now + 0.32);
            noiseNode.stop(now + 0.32);
        }
    }

    playExplosion(scale = 1.0, isBlackHole = false) {
        if (!this.enabled || !this.ensureContext()) return;

        // Support string presets (e.g. 'small', 'cluster', 'large', 'nuke') or numeric values
        let numericScale = 1.0;
        if (typeof scale === 'string') {
            if (scale === 'small') numericScale = 0.6;
            else if (scale === 'large' || scale === 'cluster') numericScale = 1.6;
            else if (scale === 'nuke') numericScale = 2.4;
            else numericScale = parseFloat(scale) || 1.0;
        } else if (typeof scale === 'number' && !isNaN(scale) && scale > 0) {
            numericScale = scale;
        }

        const ctx = this.ctx;
        if (!ctx) return;
        const now = ctx.currentTime;
        const duration = Math.max(0.15, Math.min(3.0, 0.6 * numericScale));

        try {
            // White noise base
            const noise = this.createNoiseBuffer(ctx, duration);
            const noiseNode = noise ? ctx.createBufferSource() : null;
            if (noiseNode) noiseNode.buffer = noise;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(isBlackHole ? 400 : Math.min(2000, 800 * numericScale), now);
            filter.frequency.exponentialRampToValueAtTime(30, now + duration);

            // Deep sub bass oscillator for physical impact
            const subOsc = ctx.createOscillator();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(Math.min(300, 120 * numericScale), now);
            subOsc.frequency.exponentialRampToValueAtTime(20, now + duration * 0.8);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(this.volume * Math.min(1.0, 0.7 * numericScale), now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            if (noiseNode) {
                noiseNode.connect(filter);
                filter.connect(gain);
                noiseNode.start(now);
                noiseNode.stop(now + duration + 0.05);
            }
            subOsc.connect(gain);
            gain.connect(ctx.destination);

            subOsc.start(now);
            subOsc.stop(now + duration + 0.05);
        } catch (e) {
            console.warn('Audio playExplosion suppressed error:', e);
        }
    }

    playBlackHoleLoop() {
        if (!this.enabled || !this.ensureContext()) return null;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(45, now);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(47, now); // subtle binaural beat

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(110, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.volume * 0.35, now + 0.5);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);

        return {
            stop: () => {
                const stopNow = ctx.currentTime;
                gain.gain.linearRampToValueAtTime(0.001, stopNow + 0.5);
                setTimeout(() => {
                    try {
                        osc1.stop();
                        osc2.stop();
                    } catch (e) {}
                }, 550);
            }
        };
    }

    playJump() {
        if (!this.enabled || !this.ensureContext()) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.15);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
    }

    playJetpack() {
        if (!this.enabled || !this.ensureContext()) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const noise = this.createNoiseBuffer(ctx, 0.1);
        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noise;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.25, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.1);

        noiseNode.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noiseNode.start(now);
        noiseNode.stop(now + 0.11);
    }

    playHit() {
        if (!this.enabled || !this.ensureContext()) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
    }

    playTurnStart() {
        if (!this.enabled || !this.ensureContext()) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(650, now + 0.08);
        osc.frequency.setValueAtTime(880, now + 0.16);

        gain.gain.setValueAtTime(this.volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
    }

    playWin() {
        if (!this.enabled || !this.ensureContext()) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73];

        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);

            gain.gain.setValueAtTime(0, now + idx * 0.12);
            gain.gain.linearRampToValueAtTime(this.volume * 0.5, now + idx * 0.12 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.65);
        });
    }

    createNoiseBuffer(ctx, duration) {
        if (!ctx) return null;
        const sampleRate = (ctx.sampleRate && !isNaN(ctx.sampleRate) && ctx.sampleRate > 0) ? ctx.sampleRate : 44100;
        let safeDuration = 0.4;
        if (typeof duration === 'number' && !isNaN(duration) && duration > 0) {
            safeDuration = duration;
        } else if (typeof duration === 'string') {
            const parsed = parseFloat(duration);
            if (!isNaN(parsed) && parsed > 0) safeDuration = parsed;
        }

        const bufferSize = Math.max(512, Math.floor(sampleRate * safeDuration));
        try {
            const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
            const output = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            return buffer;
        } catch (e) {
            console.warn('AudioContext createNoiseBuffer suppressed error:', e);
            return null;
        }
    }
}

export const sound = new SoundEngine();

