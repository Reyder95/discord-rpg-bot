// Base Entity. All Entities (players, enemies, bosses) will derive from this.

module.exports = class EntityBase {
    constructor(name, description, level, armor, maxHealth, currHealth, spellResist, spellbook,weapons) {
        this.name = name;
        this.description = description;
        this.level = level;
        this.spellbook = spellbook;
        this.weapons = weapons;

        this.stats = {
            armor: armor,
            maxHealth: maxHealth,
            currHealth: currHealth,
            spellResist: spellResist,
            strength: 100 * level / 25,
            dexterity: 100 * level / 25,
            intelligence: 100 * level / 25,
            baseAttack: Math.floor(50 + level * ((3/4) * level))
        }
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getLevel() {
        return this.level;
    }

    getStats() {
        return this.stats;
    }

    getSpellBook() {
        return this.spellbook;
    }

    // Attacks an enemy
    Attack(enemy) {

        // The amount of damage we are doing with our weapons
        let weaponAttack = this.stats.baseAttack; /*(this.weapons.left != null ? this.weapons.left.getAttack() + this.stats[this.weapons.left.getStat()] / 2 : 0) +
                            (this.weapons.right != null ? this.weapons.right.getAttack() + this.stats[this.weapons.right.getStat()] / 2 : 0)*/

        if (this.weapons) {
            if (this.weapons.left)
                weaponAttack += this.weapons.left.getAttack() + this.stats[this.weapons.left.getStat()] / 2
            if (this.weapons.right)
                weaponAttack += this.weapons.right.getAttack() + this.stats[this.weapons.right.getStat()] / 2
        }
        // Calculate the lower bound for the random number generator
        let lowerbound = Math.sqrt(weaponAttack) + (3 / 4) * weaponAttack;

        // Calculate a random damage value within the lower and upper bounds
        let randAttack = Math.random() * (weaponAttack - lowerbound) + lowerbound;

        return enemy.TakeDamage(this.stats.baseAttack + randAttack);
    }

    TakeDamage(damage) {
        
        // Calculate the amount of actual damage done based on armor
        let damageDone = Math.floor(damage * (100 / (100 + this.stats.armor)));

        // Reduce the entity's health
        this.stats.currHealth -= damageDone;

        // If current health is less than 0, set it to 0
        if (this.stats.currHealth <= 0)
            this.stats.currHealth = 0;

        // Return the damage done
        return damageDone;
    }

    TakeMagicDamage(damage) {
        let damageDone = Math.floor(damage * (100 / (100 + this.stats.spellResist)));

        // Reduce the entity's health
        this.stats.currHealth -= damageDone;

        // If current health is less than 0, set it to 0
        if (this.stats.currHealth <= 0)
            this.stats.currHealth = 0;

        // Return the damage done
        return damageDone;
    }
}