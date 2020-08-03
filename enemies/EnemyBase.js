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
        let lowerBound = Math.sqrt(this.weaponAttack) + (3 / 4) * this.weaponAttack;
        let randAttack = Math.random() * (this.weaponAttack - lowerBound) + lowerBound
        return player.TakeDamage(randAttack)
    }

    TakeDamage(damage) {
        let damageDone = Math.floor(damage * (100 / (100 + this.armor)));

        this.currHealth -= damageDone;

        if (this.currHealth <= 0)
            this.currHealth = 0;

        return damageDone;
    }
}