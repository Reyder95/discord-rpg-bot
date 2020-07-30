// Base class for all enemy types.

module.exports = class EnemyBase {
    constructor(name, description, stats, level, armor, currHealth, weaponAttack, maxHealth, rarity) {
        this.name = name;
        this.description = description;
        this.armor = armor;
        this.maxHealth = maxHealth;
        this.currHealth = currHealth;
        this.stats = stats;
        this.level = level;
        this.weaponAttack = weaponAttack;
        this.rarity = rarity;
    }

    getName() {
        return this.name;
    }

    getMaximumHealth() {
        return this.maxHealth;
    }

    getCurrentHealth() {
        return this.currHealth;
    }

    getLevel() {
        return this.level;
    }

    getRarity() {
        return this.rarity;
    }

    Attack(player) {
        return player.TakeDamage(this.weaponAttack)
    }

    TakeDamage(damage) {
        let damageDone = Math.floor(damage - (this.armor / 2));

        this.currHealth -= damageDone;

        if (this.currHealth <= 0)
            this.currHealth = 0;

        return damageDone;
    }
}