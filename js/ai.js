// Smart Bot AI for Radial Falling Sand Artillery Battles

export class BotAI {
    constructor(game) {
        this.game = game;
        this.timer = 0;
        this.state = 'idle'; // 'idle', 'aiming', 'ready_to_fire'
        this.targetPlayer = null;
        this.chosenWeapon = 0;
        this.targetAngle = 0;
        this.targetPower = 50;
    }

    startTurn(bot) {
        this.timer = 1.0 + Math.random() * 0.8;
        this.state = 'aiming';

        // 1. Find nearest enemy player
        const enemies = this.game.players.filter(p => p !== bot && !p.isDead && p.team !== bot.team);
        if (enemies.length === 0) return;

        // Choose enemy with lowest health or closest angular distance
        enemies.sort((a, b) => {
            let diffA = Math.abs(a.angle - bot.angle);
            while (diffA > Math.PI) diffA = Math.PI * 2 - diffA;
            let diffB = Math.abs(b.angle - bot.angle);
            while (diffB > Math.PI) diffB = Math.PI * 2 - diffB;
            return diffA - diffB;
        });

        this.targetPlayer = enemies[0];

        // 2. Determine shortest direction along planet circumference
        let angularDiff = this.targetPlayer.angle - bot.angle;
        while (angularDiff > Math.PI) angularDiff -= Math.PI * 2;
        while (angularDiff < -Math.PI) angularDiff += Math.PI * 2;

        bot.facing = angularDiff >= 0 ? 1 : -1;

        // 3. Select weapon based on distance
        const absDiff = Math.abs(angularDiff);
        if (absDiff > 1.8 && bot.ammoInventory['nuke'] > 0 && Math.random() < 0.4) {
            bot.currentWeaponIndex = this.game.weapons.findIndex(w => w.id === 'nuke');
        } else if (absDiff > 1.2 && bot.ammoInventory['magma'] > 0 && Math.random() < 0.35) {
            bot.currentWeaponIndex = this.game.weapons.findIndex(w => w.id === 'magma');
        } else if (absDiff > 0.8 && bot.ammoInventory['cluster'] > 0 && Math.random() < 0.35) {
            bot.currentWeaponIndex = this.game.weapons.findIndex(w => w.id === 'cluster');
        } else {
            bot.currentWeaponIndex = 0; // Default Kinetic Shell
        }

        // 4. Calculate ballistic orbital trajectory
        const weapon = this.game.weapons[bot.currentWeaponIndex];
        const baseAngle = 0.35 + Math.random() * 0.25; // 20 to 35 deg above horizon
        const distFactor = Math.min(1.0, absDiff / Math.PI);
        const requiredPower = Math.round(35 + distFactor * 55 + (Math.random() - 0.5) * 8);

        this.targetAngle = baseAngle;
        this.targetPower = Math.max(15, Math.min(100, requiredPower));
    }

    update(dt, bot) {
        if (this.state === 'idle' || !bot || bot.isDead || !bot.isAI) return;

        this.timer -= dt;

        if (this.state === 'aiming') {
            // Smoothly interpolate aim
            bot.aimAngle += (this.targetAngle - bot.aimAngle) * 4.0 * dt;
            bot.aimPower += (this.targetPower - bot.aimPower) * 4.0 * dt;

            if (this.timer <= 0) {
                this.state = 'ready_to_fire';
                this.timer = 0.5 + Math.random() * 0.4;
            }
        } else if (this.state === 'ready_to_fire') {
            if (this.timer <= 0) {
                this.state = 'idle';
                this.game.fireCurrentWeapon();
            }
        }
    }
}
