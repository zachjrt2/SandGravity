// Main Application Entry & UI Controller for Radial Falling Sand Simulation
import { GravityGame } from './game.js';
import { sound } from './audio.js';
import { MAT, MAT_PROPS } from './sand_engine.js';
import { HARDNESS_TIERS, VOLATILITY_TIERS } from './incremental.js';

let game = null;

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const fxCanvas = document.getElementById('fxCanvas');
    if (!canvas) return;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (fxCanvas) {
            fxCanvas.width = window.innerWidth;
            fxCanvas.height = window.innerHeight;
        }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // DOM Elements
    const matInfoTitle = document.getElementById('mat-info-title');
    const matInfoDesc = document.getElementById('mat-info-desc');

    function showMaterialInfo(toolName) {
        if (!matInfoTitle || !matInfoDesc) return;
        if (toolName.startsWith('spray_')) {
            const key = toolName.replace('spray_', '').toUpperCase();
            const matId = MAT[key];
            if (matId !== undefined && MAT_PROPS[matId]) {
                const props = MAT_PROPS[matId];
                const densityText = props.density < 0 ? `Density: ${props.density} (Rises)` : (props.density === 1000 ? `Density: Fixed` : `Density: ${props.density}`);
                matInfoTitle.innerHTML = `${props.name} <span style="font-size: 10px; color: #38bdf8; font-weight: normal; margin-left: 6px;">[${densityText}]</span>`;
                matInfoDesc.textContent = props.desc || 'Powder Toy reactive element.';
                return;
            }
        } else if (toolName === 'clear_circle') {
            matInfoTitle.textContent = 'Eraser / Void';
            matInfoDesc.textContent = 'Deletes material in brush radius.';
        } else if (toolName === 'blast_bomb') {
            matInfoTitle.textContent = 'Blast Bomb';
            matInfoDesc.textContent = 'Triggers high-energy explosive crater ejection.';
        }
    }

    const btnToggleHeatmap = document.getElementById('btn-toggle-heatmap');
    const thermalLegend = document.getElementById('thermal-legend');
    const btnQuickReset = document.getElementById('btn-quick-reset');
    const btnChaosPlanet = document.getElementById('btn-chaos-planet');
    const btnResetPlanet = document.getElementById('btn-reset-planet');
    const btnSoundToggle = document.getElementById('btn-sound-toggle');
    const btnHelpModal = document.getElementById('btn-help-modal');
    const btnCloseHelp = document.getElementById('btn-close-help');
    const modalHelp = document.getElementById('modal-help');

    const sliderBrushSize = document.getElementById('slider-brush-size');
    const labelBrushSize = document.getElementById('label-brush-size');
    const btnToggleAntigrav = document.getElementById('btn-toggle-antigrav');

    // Incremental HUD Elements
    const hudStardustVal = document.getElementById('hud-stardust-val');
    const hudOmegaVal = document.getElementById('hud-omega-val');
    const hudTierBadge = document.getElementById('hud-tier-badge');
    const coreHpFill = document.getElementById('core-hp-fill');
    const coreHpVal = document.getElementById('core-hp-val');

    // Right-Side Shop Drawer Elements
    const shopPanel = document.getElementById('shop-panel');
    const btnToggleShopPanel = document.getElementById('btn-toggle-shop-panel');
    const tabWeapons = document.getElementById('tab-content-weapons');
    const tabVolatility = document.getElementById('tab-content-volatility');
    const tabMeta = document.getElementById('tab-content-meta');

    function toggleHeatmap() {
        game.heatMapMode = !game.heatMapMode;
        if (btnToggleHeatmap) {
            btnToggleHeatmap.classList.toggle('active', game.heatMapMode);
            btnToggleHeatmap.innerHTML = game.heatMapMode ? '🔥 HEATMAP: ON' : '🔥 HEATMAP: OFF';
        }
        if (thermalLegend) {
            thermalLegend.classList.toggle('visible', game.heatMapMode);
        }
        sound.playShoot('energy');
    }

    if (btnToggleHeatmap) {
        btnToggleHeatmap.addEventListener('click', toggleHeatmap);
    }

    // UI Hooks for Game Engine
    const uiHooks = {
        onFpsUpdate: (fps) => {
            const fpsVal = document.getElementById('fps-val');
            if (fpsVal) {
                fpsVal.textContent = fps;
                if (fps >= 50) fpsVal.style.color = '#4ade80';
                else if (fps >= 30) fpsVal.style.color = '#facc15';
                else fpsVal.style.color = '#f87171';
            }
        }
    };

    // Initialize Game Engine
    game = new GravityGame(canvas, uiHooks);
    game.startLoop();

    function formatNumber(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
        return Math.floor(num).toLocaleString();
    }

    // Render Weapon Upgrades Tab
    function renderShopWeapons() {
        if (!tabWeapons || !game.incrementalEngine) return;
        const inc = game.incrementalEngine;
        let html = '';

        for (const [key, up] of Object.entries(inc.upgrades)) {
            const cost = inc.getUpgradeCost(key);
            const canAfford = inc.stardust >= cost;
            html += `
                <div class="upgrade-card">
                    <div class="upgrade-header">
                        <div class="upgrade-title-wrap">
                            <span class="upgrade-icon">${up.icon}</span>
                            <span>${up.name}</span>
                        </div>
                        <span class="upgrade-level-badge">Lv. ${up.level}</span>
                    </div>
                    <div class="upgrade-desc">${up.desc}</div>
                    <button class="upgrade-buy-btn" data-buy-up="${key}" ${canAfford ? '' : 'disabled'}>
                        ✨ ${formatNumber(cost)} ST
                    </button>
                </div>
            `;
        }
        tabWeapons.innerHTML = html;

        tabWeapons.querySelectorAll('[data-buy-up]').forEach(btn => {
            btn.addEventListener('click', () => {
                const upId = btn.dataset.buyUp;
                inc.buyUpgrade(upId);
                renderShopWeapons();
                updateIncrementalUI();
            });
        });
    }

    // Render Crust Hardness & Geological Tiers Tab
    function renderShopVolatility() {
        if (!tabVolatility || !game.incrementalEngine) return;
        const inc = game.incrementalEngine;
        let html = '';

        for (let tierId = 1; tierId <= 6; tierId++) {
            const t = HARDNESS_TIERS[tierId];
            const isUnlocked = tierId <= inc.maxUnlockedTier;
            const isCurrent = tierId === inc.currentTier;
            const canUnlock = !isUnlocked && tierId === inc.maxUnlockedTier + 1 && inc.stardust >= t.unlockCost;

            let actionBtn = '';
            if (isCurrent) {
                actionBtn = `<span style="font-size: 10px; font-weight: bold; color: #4ade80;">ACTIVE WORLD</span>`;
            } else if (isUnlocked) {
                actionBtn = `<button class="upgrade-buy-btn" data-set-tier="${tierId}">DEPLOY</button>`;
            } else {
                actionBtn = `
                    <button class="upgrade-buy-btn" data-unlock-tier="${tierId}" ${canUnlock ? '' : 'disabled'}>
                        UNLOCK ✨ ${formatNumber(t.unlockCost)} ST
                    </button>
                `;
            }

            html += `
                <div class="upgrade-card" style="border-left: 3px solid ${t.badgeColor};">
                    <div class="upgrade-header">
                        <div class="upgrade-title-wrap">
                            <span style="color: ${t.badgeColor}; font-weight: 600;">${t.classification}</span>
                        </div>
                        <span class="upgrade-level-badge" style="color: #ff88dd;">+${t.coreReward} Ω</span>
                    </div>
                    <div style="font-size: 10px; color: #fbbf24; margin-bottom: 3px;">
                        Hardness: ${t.hardnessLabel} (${t.hardnessRating}x) &nbsp;•&nbsp; <span style="color: #67e8f9;">${t.sizeLabel || ''}</span>
                    </div>
                    <div class="upgrade-desc">${t.desc}</div>
                    <div style="font-size: 9px; color: #00f0ff; margin-top: 4px; display: flex; justify-content: space-between;">
                        <span>Stardust Yield: <b>${t.stardustMultiplier}x</b></span>
                        <span style="color: #a78bfa;">Core Bounty: <b>${t.coreReward} Ω</b></span>
                    </div>
                    <div style="align-self: flex-end; margin-top: 4px;">
                        ${actionBtn}
                    </div>
                </div>
            `;
        }
        tabVolatility.innerHTML = html;

        tabVolatility.querySelectorAll('[data-unlock-tier]').forEach(btn => {
            btn.addEventListener('click', () => {
                const tier = parseInt(btn.dataset.unlockTier, 10);
                inc.unlockHardnessTier(tier);
                renderShopVolatility();
                updateIncrementalUI();
            });
        });

        tabVolatility.querySelectorAll('[data-set-tier]').forEach(btn => {
            btn.addEventListener('click', () => {
                const tier = parseInt(btn.dataset.setTier, 10);
                inc.setPlanetTier(tier);
                renderShopVolatility();
                updateIncrementalUI();
            });
        });
    }

    // Render Meta-Observatory Tab
    function renderShopMeta() {
        if (!tabMeta || !game.incrementalEngine) return;
        const inc = game.incrementalEngine;
        let html = '';

        for (const [key, perk] of Object.entries(inc.metaPerks)) {
            const cost = inc.getMetaCost(key);
            const canAfford = inc.omegaCores >= cost;
            html += `
                <div class="upgrade-card">
                    <div class="upgrade-header">
                        <div class="upgrade-title-wrap">
                            <span class="upgrade-icon">${perk.icon}</span>
                            <span>${perk.name}</span>
                        </div>
                        <span class="upgrade-level-badge" style="color: #ff007f;">Lv. ${perk.level}</span>
                    </div>
                    <div class="upgrade-desc">${perk.desc}</div>
                    <button class="upgrade-buy-btn meta-btn" data-buy-meta="${key}" ${canAfford ? '' : 'disabled'}>
                        💎 ${cost} Ω
                    </button>
                </div>
            `;
        }
        tabMeta.innerHTML = html;

        tabMeta.querySelectorAll('[data-buy-meta]').forEach(btn => {
            btn.addEventListener('click', () => {
                const metaId = btn.dataset.buyMeta;
                inc.buyMetaPerk(metaId);
                renderShopMeta();
                updateIncrementalUI();
            });
        });
    }

    // Live Sync Incremental Stats, HUD & Button Affordability
    function updateIncrementalUI() {
        if (!game || !game.incrementalEngine) return;
        const inc = game.incrementalEngine;

        if (hudStardustVal) hudStardustVal.textContent = formatNumber(inc.stardust);
        if (hudOmegaVal) hudOmegaVal.textContent = inc.omegaCores.toLocaleString();

        if (hudTierBadge) {
            const tierData = HARDNESS_TIERS[inc.currentTier] || HARDNESS_TIERS[1];
            if (tierData) {
                hudTierBadge.textContent = `${tierData.classification.toUpperCase()} • ${tierData.hardnessLabel}`;
                hudTierBadge.style.color = tierData.badgeColor;
                hudTierBadge.style.borderColor = tierData.badgeColor;
            }
        }

        if (coreHpFill && coreHpVal) {
            const pct = Math.round(inc.coreHealthPct * 100);
            coreHpFill.style.width = `${pct}%`;
            coreHpVal.textContent = `${pct}%`;
            if (pct <= 25) {
                coreHpFill.style.background = 'linear-gradient(90deg, #ff0000, #ff0055)';
            } else {
                coreHpFill.style.background = 'linear-gradient(90deg, #ff0055, #ff6600, #ffe600)';
            }
        }

        // Dynamically un-gray / enable buttons in real-time as stardust / omega cores are earned!
        document.querySelectorAll('[data-buy-up]').forEach(btn => {
            const upId = btn.dataset.buyUp;
            const cost = inc.getUpgradeCost(upId);
            btn.disabled = inc.stardust < cost;
        });

        document.querySelectorAll('[data-unlock-tier]').forEach(btn => {
            const tier = parseInt(btn.dataset.unlockTier, 10);
            const tData = HARDNESS_TIERS[tier];
            const canUnlock = tData && tier === inc.maxUnlockedTier + 1 && inc.stardust >= tData.unlockCost;
            btn.disabled = !canUnlock;
        });

        document.querySelectorAll('[data-buy-meta]').forEach(btn => {
            const metaId = btn.dataset.buyMeta;
            const cost = inc.getMetaCost(metaId);
            btn.disabled = inc.omegaCores < cost;
        });
    }

    // Initial Shop Render
    renderShopWeapons();
    renderShopVolatility();
    renderShopMeta();

    // High frequency UI update interval (every 100ms)
    setInterval(() => {
        updateIncrementalUI();
    }, 100);

    // Shop Panel Tabs Switching
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabKey = tab.dataset.shoptab;
            if (tabWeapons) tabWeapons.style.display = tabKey === 'weapons' ? 'flex' : 'none';
            if (tabVolatility) tabVolatility.style.display = tabKey === 'volatility' ? 'flex' : 'none';
            if (tabMeta) tabMeta.style.display = tabKey === 'meta' ? 'flex' : 'none';

            if (tabKey === 'weapons') renderShopWeapons();
            if (tabKey === 'volatility') renderShopVolatility();
            if (tabKey === 'meta') renderShopMeta();
        });
    });

    // Shop Panel Minimize Toggle
    if (btnToggleShopPanel && shopPanel) {
        btnToggleShopPanel.addEventListener('click', () => {
            const isMin = shopPanel.classList.toggle('minimized');
            btnToggleShopPanel.textContent = isMin ? '◀' : '▶';
        });
    }

    // Prevent right-click context menu on canvas for panning
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Panel Minimize / Expand Toggle
    const btnTogglePanel = document.getElementById('btn-toggle-sandbox-panel');
    const sandboxPanel = document.getElementById('sandbox-panel');
    if (btnTogglePanel && sandboxPanel) {
        btnTogglePanel.addEventListener('click', () => {
            const isMin = sandboxPanel.classList.toggle('minimized');
            btnTogglePanel.textContent = isMin ? '▶' : '◀';
        });
    }

    // Collapsible Accordion Header Clicks
    document.querySelectorAll('.cat-accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const acc = header.closest('.cat-accordion');
            if (acc) acc.classList.toggle('collapsed');
        });
    });

    // Category Tab Switching
    document.querySelectorAll('.cat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.cat;
            document.querySelectorAll('.cat-accordion').forEach(acc => {
                if (cat === 'all') {
                    acc.style.display = 'block';
                } else if (acc.dataset.cat === cat) {
                    acc.style.display = 'block';
                    acc.classList.remove('collapsed');
                } else {
                    acc.style.display = 'none';
                }
            });
        });
    });

    // Material Brush Selector & Info Card Trigger
    document.querySelectorAll('#sandbox-panel .tool-btn[data-tool]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#sandbox-panel .tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            game.sandboxTool = btn.dataset.tool;
            showMaterialInfo(btn.dataset.tool);
        });

        btn.addEventListener('mouseenter', () => {
            showMaterialInfo(btn.dataset.tool);
        });
    });

    function updateBrushSize(newSize) {
        const clamped = Math.max(1, Math.min(250, newSize));
        game.brushSize = clamped;
        if (sliderBrushSize) sliderBrushSize.value = Math.min(150, clamped);
        if (labelBrushSize) labelBrushSize.textContent = `${clamped}px`;
    }

    // Brush Size Slider
    if (sliderBrushSize) {
        sliderBrushSize.addEventListener('input', (e) => {
            updateBrushSize(parseInt(e.target.value, 10));
        });
    }

    // Invert Gravity Button
    if (btnToggleAntigrav) {
        btnToggleAntigrav.addEventListener('click', () => {
            game.sandEngine.gravityInverted = !game.sandEngine.gravityInverted;
            btnToggleAntigrav.textContent = `Invert Gravity: ${game.sandEngine.gravityInverted ? 'ON (Outward)' : 'OFF (Inward)'}`;
            btnToggleAntigrav.style.color = game.sandEngine.gravityInverted ? '#fa50da' : '#ffffff';
        });
    }

    // Planet Reset Actions
    function triggerPlanetReset() {
        game.resetPlanet();
        sound.playShoot('terraform');
    }

    function triggerChaosPlanet() {
        game.chaosPlanet();
        sound.playExplosion(1.6);
        game.triggerScreenShake(6, 0.25);
    }

    if (btnQuickReset) btnQuickReset.addEventListener('click', triggerPlanetReset);
    if (btnChaosPlanet) btnChaosPlanet.addEventListener('click', triggerChaosPlanet);
    if (btnResetPlanet) btnResetPlanet.addEventListener('click', triggerPlanetReset);

    // Sound Toggle
    if (btnSoundToggle) {
        btnSoundToggle.addEventListener('click', () => {
            sound.enabled = !sound.enabled;
            btnSoundToggle.style.color = sound.enabled ? '#00f0ff' : '#64748b';
        });
    }

    // Help Modal
    if (btnHelpModal && modalHelp) btnHelpModal.addEventListener('click', () => modalHelp.classList.remove('hidden'));
    if (btnCloseHelp && modalHelp) btnCloseHelp.addEventListener('click', () => modalHelp.classList.add('hidden'));

    // Mouse & Keyboard Event Handlers on Window
    window.addEventListener('mousedown', (e) => {
        if (e.target.closest('#top-hud, #sandbox-panel, #shop-panel, .corner-tools, .modal-overlay, #thermal-legend')) return;

        // Right-Click (button 2), Middle-Click (button 1), or Space+Click initiates smooth camera panning
        if (e.button === 2 || e.button === 1 || (e.button === 0 && game.keys[' '])) {
            game.camera.isPanning = true;
            game.camera.panStartX = e.clientX;
            game.camera.panStartY = e.clientY;
            game.camera.panOriginX = game.camera.targetX;
            game.camera.panOriginY = game.camera.targetY;
            return;
        }

        // Discrete single click action only (no hold / drag-mining)
        if (e.button === 0) {
            game.isMouseDown = true;
            game.mousePos = { x: e.clientX, y: e.clientY };
            const worldPos = game.screenToWorld(e.clientX, e.clientY);
            game.handleSandboxPaint(worldPos.x, worldPos.y);
        }
    });

    window.addEventListener('mousemove', (e) => {
        game.mousePos = { x: e.clientX, y: e.clientY };

        if (game.camera.isPanning) {
            const dx = (e.clientX - game.camera.panStartX) / game.camera.zoom;
            const dy = (e.clientY - game.camera.panStartY) / game.camera.zoom;
            game.camera.targetX = game.camera.panOriginX - dx;
            game.camera.targetY = game.camera.panOriginY - dy;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button === 2 || e.button === 1 || game.camera.isPanning) {
            game.camera.isPanning = false;
        }
        game.isMouseDown = false;
    });

    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        game.keys[key] = true;
        if (e.key === ' ') game.keys[' '] = true;

        // '[' and ']' keys adjust brush radius
        if (e.key === '[' || e.key === '{') {
            updateBrushSize(game.brushSize - (game.brushSize > 25 ? 5 : 2));
        }
        if (e.key === ']' || e.key === '}') {
            updateBrushSize(game.brushSize + (game.brushSize >= 25 ? 5 : 2));
        }

        // 'H' key toggles FLIR thermal heatmap mode
        if (key === 'h') {
            toggleHeatmap();
        }

        // 'C' key clears simulation grid
        if (key === 'c') {
            game.sandEngine.reset();
            sound.playExplosion(0.6);
        }

        // 'R' key regenerates default terrestrial planet
        if (key === 'r') {
            triggerPlanetReset();
        }

        // 'X' key spawns 100% random chaos planet
        if (key === 'x') {
            triggerChaosPlanet();
        }
    });

    window.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        game.keys[key] = false;
        if (e.key === ' ') game.keys[' '] = false;
    });

    // Smooth Multiplicative Mouse Wheel Zoom & Shift+Wheel Brush Scaling
    window.addEventListener('wheel', (e) => {
        if (e.target.closest('#top-hud, #sandbox-panel, .modal-overlay, .material-list-scroll')) return;
        e.preventDefault();

        // Shift + Wheel adjusts brush size directly!
        if (e.shiftKey) {
            const step = game.brushSize >= 30 ? 5 : 2;
            const delta = e.deltaY < 0 ? step : -step;
            updateBrushSize(game.brushSize + delta);
            return;
        }

        const factor = e.deltaY < 0 ? 1.15 : 0.86;
        game.camera.userZoom = Math.max(0.10, Math.min(4.5, game.camera.userZoom * factor));
        game.camera.targetZoom = game.camera.userZoom;
    }, { passive: false });
});
