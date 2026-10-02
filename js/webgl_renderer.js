// High-Performance WebGL2 GPU Accelerated Renderer for Radial Powder Simulation
// Features: Direct texture streaming, GPU camera transform, HDR multi-tap bloom,
// emissive plasma/lightning glow, and fragment-shader cosmic space-time web.

export class WebGLRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2', {
            alpha: false,
            antialias: false,
            powerPreference: 'high-performance',
            premultipliedAlpha: false,
            preserveDrawingBuffer: false
        });

        this.isSupported = !!this.gl;
        if (!this.isSupported) {
            console.warn('[WebGLRenderer] WebGL2 not supported, falling back to 2D Canvas.');
            return;
        }

        this.initShaders();
        this.initBuffers();
        this.initTexture();
        this.initParticleShader();
    }

    initShaders() {
        const gl = this.gl;

        const vsSource = `#version 300 es
        in vec2 a_position;
        in vec2 a_texCoord;

        uniform vec2 u_resolution;
        uniform vec2 u_cameraPos;
        uniform float u_zoom;
        uniform vec2 u_simSize;
        uniform float u_scale;

        out vec2 v_texCoord;
        out vec2 v_worldPos;

        void main() {
            // Quad in world coordinates [-simWidth*scale/2, +simWidth*scale/2]
            vec2 worldPos = (a_position - 0.5) * u_simSize * u_scale;
            v_worldPos = worldPos;

            // Apply camera transform to screen space
            vec2 screenPos = (worldPos - u_cameraPos) * u_zoom;

            // Convert to clip space [-1, 1] (WebGL standard, Y-flipped for canvas coordinates)
            vec2 clipPos = (screenPos / (u_resolution * 0.5));
            clipPos.y = -clipPos.y; // Correct canvas Y orientation

            gl_Position = vec4(clipPos, 0.0, 1.0);
            v_texCoord = a_texCoord;
        }`;

        const fsSource = `#version 300 es
        precision highp float;

        in vec2 v_texCoord;
        in vec2 v_worldPos;

        uniform sampler2D u_sandTexture;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_zoom;
        uniform float u_heatMapMode;

        out vec4 fragColor;

        void main() {
            vec2 uv = v_texCoord;

            // 1. Thermal Micro-Shimmer above High-Heat Matter
            float heatWave = sin(uv.y * 180.0 + u_time * 6.0) * 0.0008;
            vec2 sampleUv = uv + vec2(heatWave * 0.4, 0.0);
            vec4 col = texture(u_sandTexture, sampleUv);

            // FLIR / Ironbow Thermal Heatmap Mode
            if (u_heatMapMode > 0.5) {
                if (col.a < 0.05) {
                    // Deep space with faint thermal grid
                    vec2 grid = abs(fract(v_worldPos * 0.015) - 0.5);
                    float line = smoothstep(0.47, 0.5, max(grid.x, grid.y));
                    fragColor = vec4(0.01 + line * 0.02, 0.02 + line * 0.03, 0.06 + line * 0.06, 0.4);
                    return;
                }

                // Estimate temperature normalized in [0.0, 1.0]
                float temp = 0.35; // Default ambient
                
                if (col.b > 0.85 && col.r > 0.85 && col.g > 0.85) {
                    temp = 0.12; // Snow / Ice
                } else if (col.b > 0.70 && col.r < 0.40 && col.g < 0.60) {
                    temp = 0.28; // Water
                } else if (col.b > 0.80 && col.r > 0.60 && col.g < 0.40) {
                    temp = 0.04; // LN2 Sub-Zero Cryogen (-200°C)
                } else if (col.r > 0.90 && col.g > 0.80 && col.b < 0.30) {
                    temp = 0.86; // Lava / Thermite (~1200°C)
                } else if (col.r > 0.85 && col.g < 0.40 && col.b < 0.20) {
                    temp = 0.74; // Fire (~600°C)
                } else if (col.r < 0.25 && col.g > 0.85 && col.b > 0.85) {
                    temp = 0.98; // Plasma / Spark / Lightning (~5000°C+)
                } else if (col.r < 0.25 && col.g > 0.85 && col.b < 0.30) {
                    temp = 0.45; // Acid / Uranium exothermic
                } else if (col.a < 0.70 && (col.r > 0.6 || col.g > 0.6 || col.b > 0.6)) {
                    temp = 0.58; // Steam / Hot vapor (~100°C)
                } else if (col.a < 0.70) {
                    temp = 0.48; // Smoke / Warm exhaust
                } else if (col.g > 0.55 && col.r < 0.40) {
                    temp = 0.32; // Flora biosphere
                } else {
                    float brightness = max(col.r, max(col.g, col.b));
                    temp = 0.32 + brightness * 0.18; // Lithosphere rocks & soils
                }

                // High-Contrast FLIR Ironbow Thermal Spectrum
                vec3 heatRgb;
                if (temp < 0.2) {
                    heatRgb = mix(vec3(0.04, 0.02, 0.35), vec3(0.08, 0.35, 0.95), temp / 0.2);
                } else if (temp < 0.4) {
                    heatRgb = mix(vec3(0.08, 0.35, 0.95), vec3(0.05, 0.80, 0.55), (temp - 0.2) / 0.2);
                } else if (temp < 0.6) {
                    heatRgb = mix(vec3(0.05, 0.80, 0.55), vec3(0.98, 0.88, 0.05), (temp - 0.4) / 0.2);
                } else if (temp < 0.8) {
                    heatRgb = mix(vec3(0.98, 0.88, 0.05), vec3(1.0, 0.22, 0.02), (temp - 0.6) / 0.2);
                } else {
                    heatRgb = mix(vec3(1.0, 0.22, 0.02), vec3(1.0, 0.98, 0.95), (temp - 0.8) / 0.2);
                }

                fragColor = vec4(heatRgb, 1.0);
                return;
            }

            // 2. High-Efficiency Energetic 4-Tap GPU Bloom & Emissive Core
            float brightness = max(col.r, max(col.g, col.b));
            vec3 emissive = vec3(0.0);

            // Conditional bloom: only sample neighborhood for radiant energetic voxels (plasma, spark, fire, lava, photon, laser)
            if (col.a > 0.1 && (brightness > 0.52 || col.r > 0.68 || col.g > 0.75 || col.b > 0.75)) {
                emissive = col.rgb * 0.48;

                // Rotated 4-tap diagonal bilinear bloom kernel
                vec2 texel = 1.85 / vec2(textureSize(u_sandTexture, 0));
                vec3 bloom = (
                    texture(u_sandTexture, sampleUv + vec2(-texel.x, -texel.y)).rgb +
                    texture(u_sandTexture, sampleUv + vec2( texel.x, -texel.y)).rgb +
                    texture(u_sandTexture, sampleUv + vec2(-texel.x,  texel.y)).rgb +
                    texture(u_sandTexture, sampleUv + vec2( texel.x,  texel.y)).rgb
                ) * 0.25;

                emissive += bloom * 0.45;
            }

            vec3 finalRgb = col.rgb + emissive;

            // Transparent simulation cell shows through to cosmic background
            fragColor = vec4(finalRgb, col.a);
        }`;

        this.program = this.createProgram(vsSource, fsSource);

        // Uniform locations
        this.u_resolution = gl.getUniformLocation(this.program, 'u_resolution');
        this.u_cameraPos = gl.getUniformLocation(this.program, 'u_cameraPos');
        this.u_zoom = gl.getUniformLocation(this.program, 'u_zoom');
        this.u_simSize = gl.getUniformLocation(this.program, 'u_simSize');
        this.u_scale = gl.getUniformLocation(this.program, 'u_scale');
        this.u_sandTexture = gl.getUniformLocation(this.program, 'u_sandTexture');
        this.u_time = gl.getUniformLocation(this.program, 'u_time');
        this.u_heatMapMode = gl.getUniformLocation(this.program, 'u_heatMapMode');
    }

    initBackgroundShader() {
        const gl = this.gl;
        const vsSource = `#version 300 es
        in vec2 a_position;
        out vec2 v_screenPos;

        void main() {
            v_screenPos = a_position;
            gl_Position = vec4(a_position, 0.999, 1.0);
        }`;

        const fsSource = `#version 300 es
        precision highp float;

        in vec2 v_screenPos;
        uniform vec2 u_resolution;
        uniform vec2 u_cameraPos;
        uniform float u_zoom;
        uniform float u_time;

        out vec4 fragColor;

        // Fast GPU Hash & Fractal Noise
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }

        float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            vec2 shift = vec2(100.0);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
            for (int i = 0; i < 4; ++i) {
                v += a * noise(p);
                p = rot * p * 2.0 + shift;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec2 screenPixel = (v_screenPos * 0.5 + 0.5) * u_resolution;
            vec2 worldPos = (screenPixel - u_resolution * 0.5) / u_zoom + u_cameraPos;
            worldPos.y = -worldPos.y;

            float dist = length(worldPos);

            // 1. Deep Cosmic Void Background
            vec3 bg = vec3(0.010, 0.014, 0.038);

            // 2. Cosmic Nebula Clouds (Swirling Deep Purple & Neon Cyan Dust)
            vec2 nebulaCoord = worldPos * 0.00045 + vec2(u_time * 0.015, -u_time * 0.010);
            float n1 = fbm(nebulaCoord * 2.5);
            float n2 = fbm(nebulaCoord * 4.0 + vec2(n1 * 1.5, u_time * 0.02));

            vec3 nebulaColor1 = vec3(0.45, 0.05, 0.65) * n1 * 0.28; // Deep Violet
            vec3 nebulaColor2 = vec3(0.0, 0.35, 0.55) * n2 * 0.22;  // Cyan Dust
            bg += (nebulaColor1 + nebulaColor2);

            // 3. Radial Gravitational Space-Time Web Rings
            float ringFreq = 70.0;
            float ring = abs(sin(dist * 3.14159 / ringFreq));
            if (ring < 0.035) {
                bg += vec3(0.0, 0.12, 0.16) * (1.0 - smoothstep(0.0, 0.035, ring));
            }

            // 4. Radial Gravitational Vector Spoke Lines
            float angle = atan(worldPos.y, worldPos.x);
            float spokeFreq = 16.0;
            float spoke = abs(sin(angle * spokeFreq * 0.5));
            if (spoke < 0.012) {
                bg += vec3(0.0, 0.09, 0.12) * (1.0 - smoothstep(0.0, 0.012, spoke));
            }

            // 5. Central Singularity Black Hole Photon Ring & Accretion Glow
            float coreGlow = exp(-dist * 0.022);
            float photonRing = smoothstep(12.0, 2.0, abs(dist - 14.0)); // Luminous photon ring
            bg += vec3(0.0, 0.85, 1.0) * coreGlow * 0.55;
            bg += vec3(0.8, 0.2, 1.0) * photonRing * 0.65;
            bg += vec3(0.7, 0.15, 0.9) * exp(-dist * 0.008) * 0.25;

            fragColor = vec4(bg, 1.0);
        }`;

        this.bgProgram = this.createProgram(vsSource, fsSource);
        this.u_bgResolution = gl.getUniformLocation(this.bgProgram, 'u_resolution');
        this.u_bgCameraPos = gl.getUniformLocation(this.bgProgram, 'u_cameraPos');
        this.u_bgZoom = gl.getUniformLocation(this.bgProgram, 'u_zoom');
        this.u_bgTime = gl.getUniformLocation(this.bgProgram, 'u_time');
    }

    initParticleShader() {
        const gl = this.gl;
        const vsSource = `#version 300 es
        in vec2 a_pos;
        in vec4 a_color;
        in float a_size;

        uniform vec2 u_resolution;
        uniform vec2 u_cameraPos;
        uniform float u_zoom;

        out vec4 v_color;

        void main() {
            vec2 screenPos = (a_pos - u_cameraPos) * u_zoom;
            vec2 clipPos = screenPos / (u_resolution * 0.5);
            clipPos.y = -clipPos.y;

            gl_Position = vec4(clipPos, 0.0, 1.0);
            gl_PointSize = max(2.5, a_size * u_zoom);
            v_color = a_color;
        }`;

        const fsSource = `#version 300 es
        precision mediump float;
        in vec4 v_color;
        out vec4 fragColor;

        void main() {
            vec2 coord = gl_PointCoord - vec2(0.5);
            float d = length(coord);
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.1, d);
            fragColor = vec4(v_color.rgb, v_color.a * alpha);
        }`;

        this.particleProgram = this.createProgram(vsSource, fsSource);
        this.u_pResolution = gl.getUniformLocation(this.particleProgram, 'u_resolution');
        this.u_pCameraPos = gl.getUniformLocation(this.particleProgram, 'u_cameraPos');
        this.u_pZoom = gl.getUniformLocation(this.particleProgram, 'u_zoom');

        // Dynamic particle buffer & VAO
        this.particleVAO = gl.createVertexArray();
        this.particleVBO = gl.createBuffer();

        this.initCursorShader();
    }

    initCursorShader() {
        const gl = this.gl;
        const vsSource = `#version 300 es
        in vec2 a_position;
        uniform vec2 u_resolution;
        uniform vec2 u_cursorScreenPos;
        uniform float u_cursorRadiusScreen;

        void main() {
            vec2 screenPos = u_cursorScreenPos + a_position * u_cursorRadiusScreen;
            vec2 clipPos = screenPos / (u_resolution * 0.5);
            clipPos.y = -clipPos.y;
            gl_Position = vec4(clipPos, 0.0, 1.0);
        }`;

        const fsSource = `#version 300 es
        precision mediump float;
        uniform vec4 u_cursorColor;
        out vec4 fragColor;

        void main() {
            fragColor = u_cursorColor;
        }`;

        this.cursorProgram = this.createProgram(vsSource, fsSource);
        this.u_curResolution = gl.getUniformLocation(this.cursorProgram, 'u_resolution');
        this.u_curPos = gl.getUniformLocation(this.cursorProgram, 'u_cursorScreenPos');
        this.u_curRadius = gl.getUniformLocation(this.cursorProgram, 'u_cursorRadiusScreen');
        this.u_curColor = gl.getUniformLocation(this.cursorProgram, 'u_cursorColor');

        // Ring vertex buffer (64 segments)
        const segments = 64;
        const ringVerts = new Float32Array((segments + 1) * 2);
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            ringVerts[i * 2] = Math.cos(angle);
            ringVerts[i * 2 + 1] = Math.sin(angle);
        }
        this.ringVAO = gl.createVertexArray();
        gl.bindVertexArray(this.ringVAO);
        const ringVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ringVBO);
        gl.bufferData(gl.ARRAY_BUFFER, ringVerts, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
    }

    initBuffers() {
        const gl = this.gl;

        // Quad covering [0,0] to [1,1]
        const quadVertices = new Float32Array([
            // Pos (x, y), TexCoord (u, v)
            0.0, 0.0,  0.0, 0.0,
            1.0, 0.0,  1.0, 0.0,
            0.0, 1.0,  0.0, 1.0,

            0.0, 1.0,  0.0, 1.0,
            1.0, 0.0,  1.0, 0.0,
            1.0, 1.0,  1.0, 1.0
        ]);

        this.quadVAO = gl.createVertexArray();
        gl.bindVertexArray(this.quadVAO);

        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

        const FSIZE = Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, FSIZE * 4, 0);

        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

        gl.bindVertexArray(null);

        // Fullscreen background quad
        this.initBackgroundShader();
        const fullQuad = new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0
        ]);
        this.bgVAO = gl.createVertexArray();
        gl.bindVertexArray(this.bgVAO);
        const bgVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bgVBO);
        gl.bufferData(gl.ARRAY_BUFFER, fullQuad, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, FSIZE * 2, 0);
        gl.bindVertexArray(null);
    }

    initTexture() {
        const gl = this.gl;
        this.sandTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.sandTexture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // NEAREST for crisp powder toy pixels or LINEAR for smooth blends
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Allocate 2048x2048 RGBA texture storage (4x simulation resolution)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2048, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }

    createProgram(vsSource, fsSource) {
        const gl = this.gl;
        const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
        const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);

        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error('[WebGLRenderer] Program link error:', gl.getProgramInfoLog(prog));
        }
        return prog;
    }

    compileShader(type, src) {
        const gl = this.gl;
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error('[WebGLRenderer] Shader compile error:', gl.getShaderInfoLog(s));
        }
        return s;
    }

    render(game, sandEngine) {
        if (!this.isSupported) return;

        const gl = this.gl;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const now = performance.now() * 0.001;

        // Viewport
        gl.viewport(0, 0, width, height);
        gl.clearColor(0.02, 0.027, 0.067, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 1. Draw Space-Time Gravitational Web Background
        gl.useProgram(this.bgProgram);
        gl.uniform2f(this.u_bgResolution, width, height);
        gl.uniform2f(this.u_bgCameraPos, game.camera.x, game.camera.y);
        gl.uniform1f(this.u_bgZoom, game.camera.zoom);
        gl.uniform1f(this.u_bgTime, now);

        gl.bindVertexArray(this.bgVAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);

        // 2. Stream Falling Sand Texture directly to GPU (Dirty Sub-Rectangle Streaming)
        gl.bindTexture(gl.TEXTURE_2D, this.sandTexture);
        if (sandEngine.isDirty || game.isMouseDown || sandEngine.needsFullTextureUpload) {
            const u8 = new Uint8Array(sandEngine.colors.buffer);

            if (sandEngine.needsFullTextureUpload) {
                // Full Texture Upload on reset / planet spawn
                gl.texSubImage2D(
                    gl.TEXTURE_2D,
                    0,
                    0,
                    0,
                    sandEngine.width,
                    sandEngine.height,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    u8
                );
                sandEngine.needsFullTextureUpload = false;
            } else {
                // High-performance Dirty Sub-Rectangle streaming
                const bounds = sandEngine.activeBounds;
                const bMinX = bounds ? Math.max(0, bounds.minX - 8) : 0;
                const bMaxX = bounds ? Math.min(sandEngine.width - 1, bounds.maxX + 8) : sandEngine.width - 1;
                const bMinY = bounds ? Math.max(0, bounds.minY - 8) : 0;
                const bMaxY = bounds ? Math.min(sandEngine.height - 1, bounds.maxY + 8) : sandEngine.height - 1;

                const updateW = bMaxX - bMinX + 1;
                const updateH = bMaxY - bMinY + 1;

                if (updateW > 0 && updateH > 0) {
                    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, sandEngine.width);
                    gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, bMinX);
                    gl.pixelStorei(gl.UNPACK_SKIP_ROWS, bMinY);

                    gl.texSubImage2D(
                        gl.TEXTURE_2D,
                        0,
                        bMinX,
                        bMinY,
                        updateW,
                        updateH,
                        gl.RGBA,
                        gl.UNSIGNED_BYTE,
                        u8
                    );

                    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0);
                    gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, 0);
                    gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
                }
            }
            sandEngine.isDirty = false;
        }

        // 3. Render Powder Simulation Quad with Bloom & Emissive Shaders
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.useProgram(this.program);
        gl.uniform2f(this.u_resolution, width, height);
        gl.uniform2f(this.u_cameraPos, game.camera.x, game.camera.y);
        gl.uniform1f(this.u_zoom, game.camera.zoom);
        gl.uniform2f(this.u_simSize, sandEngine.width, sandEngine.height);
        gl.uniform1f(this.u_scale, sandEngine.scale);
        gl.uniform1i(this.u_sandTexture, 0);
        gl.uniform1f(this.u_time, now);
        gl.uniform1f(this.u_heatMapMode, game.heatMapMode ? 1.0 : 0.0);

        gl.bindVertexArray(this.quadVAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);

        // 4. Render Orbital Ballistic Particles on GPU
        if (sandEngine.orbitalParticles && sandEngine.orbitalParticles.length > 0) {
            this.renderParticles(sandEngine.orbitalParticles, width, height, game.camera);
        }

        // 5. Render Glowing Holographic Brush Cursor Ring
        if (game.mousePos && game.sandboxTool) {
            this.renderCursor(game, width, height);
        }

        gl.disable(gl.BLEND);
    }

    renderCursor(game, width, height) {
        if (!game.mousePos) return;
        const gl = this.gl;
        const radiusWorld = game.getMiningRadiusWorld ? game.getMiningRadiusWorld() : 4.0;
        const radiusScreen = Math.max(3.5, radiusWorld * game.camera.zoom);
        const screenX = game.mousePos.x - width * 0.5;
        const screenY = game.mousePos.y - height * 0.5;

        gl.useProgram(this.cursorProgram);
        gl.uniform2f(this.u_curResolution, width, height);
        gl.uniform2f(this.u_curPos, screenX, screenY);
        gl.uniform1f(this.u_curRadius, radiusScreen);
        gl.uniform4f(this.u_curColor, 0.0, 0.94, 1.0, 0.65);

        gl.bindVertexArray(this.ringVAO);
        gl.drawArrays(gl.LINE_STRIP, 0, 65);
        gl.bindVertexArray(null);
    }

    renderParticles(particles, width, height, camera) {
        const gl = this.gl;
        const count = particles.length;
        if (count === 0) return;

        // Pack particle data: pos (2 floats), color (4 floats), size (1 float) = 7 floats/particle
        const data = new Float32Array(count * 7);
        for (let i = 0; i < count; i++) {
            const p = particles[i];
            const offset = i * 7;
            data[offset] = p.x;
            data[offset + 1] = p.y;

            // Colors
            data[offset + 2] = 1.0;
            data[offset + 3] = 0.6;
            data[offset + 4] = 0.1;
            data[offset + 5] = 0.9;

            data[offset + 6] = (p.radius || 2) * 2.0;
        }

        gl.useProgram(this.particleProgram);
        gl.uniform2f(this.u_pResolution, width, height);
        gl.uniform2f(this.u_pCameraPos, camera.x, camera.y);
        gl.uniform1f(this.u_pZoom, camera.zoom);

        gl.bindVertexArray(this.particleVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.particleVBO);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

        const FSIZE = Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, FSIZE * 7, 0);

        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 2);

        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 1, gl.FLOAT, false, FSIZE * 7, FSIZE * 6);

        gl.drawArrays(gl.POINTS, 0, count);

        gl.disableVertexAttribArray(0);
        gl.disableVertexAttribArray(1);
        gl.disableVertexAttribArray(2);
        gl.bindVertexArray(null);
    }
}
