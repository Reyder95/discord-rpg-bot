// The player character for use in combat

module.exports = class Player {
    constructor(maxHealth, currHealth, gear, weapons, level, spellbook, spellresist, magicka) {

        // A player's complete list of stats
        this.stats = {
            strength: 100 * level / 25,    // STR - Handles more aggressive attacks and actions
            dexterity: 100 * level / 25,    // DEX - Handles more agile attacks and actions
            intelligence: 100 * level / 25,    // INT - Handles more magical attacks and actions
            maxHealth: maxHealth,    // The maximum health of the player
            currHealth: currHealth,    // The current health of the player (if this reaches 0 then gg)
            armor: 0,    // Helps reduce the damage the user takes
            spellbook: spellbook,    // A spellbook which contains all the spells the user knows
            spellresist: spellresist,    // Helps prevent the user from taking too much damage from magical attacks
            magicka: magicka    // Each spell costs magicka to cast

        }

        // The gear of the player
        this.gear = gear;    // An array of gear that a player may have
        this.weapons = weapons;    // The weapons a player may have (one left one right)

        // Buff the stats based on the gear we're using
        for (let i = 0; i < this.gear.length; i++) {
            this.stats[this.gear[i].getBonus().stat] = this.stats[this.gear[i].getBonus().stat] + this.gear[i].getBonus().bonus;
            this.stats.armor += this.gear[i].getArmorBonus();
        }
            
    }

    getArmor() {
        return this.stats.armor;
    }

    getMaximumHealth() {
        return this.stats.maxHealth;
    }

    getCurrentHealth() {
        return this.stats.currHealth;
    }

    getSpellBook() {
        return this.stats.spellbook;
    }

    // Attack a given entity
    Attack(enemy) {

        // TODO: Add possibilities for effects

        let weaponAttack = (this.weapons.left != undefined ? this.weapons.left.getAttack() + this.stats[this.weapons.left.getStat()] / 2 : 0) + (this.weapons.right != undefined ? this.weapons.right.getAttack() + this.stats[this.weapons.left.getStat()] / 2 : 0)
        
        let lowerBound = Math.sqrt(weaponAttack) + (3 / 4) * weaponAttack;
        let randAttack = Math.random() * (weaponAttack - lowerBound) + lowerBound

        
        return enemy.TakeDamage(randAttack)
    }

    // When given damage, use this formula to calculate the damage taken
    TakeDamage(damage) {
        let totalDamage = Math.floor(damage - (this.stats.armor / 2));
        this.stats.currHealth -= totalDamage;

        return totalDamage;
    }
}