// The player character for use in combat

module.exports = class Player {
    constructor(maxHealth, currHealth, gear, weapons, level, spellbook, spellresist, currentMagicka, maximumMagicka) {

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
            currentMagicka: currentMagicka,    // Each spell costs magicka to cast
            maximumMagicka: maximumMagicka    // The maximum magicka the user can have

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

    getCurrentMagicka() {
        return this.stats.currentMagicka;
    }

    getMaximumMagicka() {
        return this.stats.maximumMagicka;
    }

    Heal(amount) {
        this.stats.currHealth += amount;

        if (this.stats.currHealth > this.stats.maxHealth) {
            this.stats.currHealth = this.stats.maxHealth
        }
    }

    // Use a certain amount of magicka based on spell cost
    UseMagicka(cost) {
        this.stats.currentMagicka -= cost;
    }

    // Attack a given entity
    Attack(enemy) {

        // TODO: Add possibilities for effects

        // Calculate the damage of a weapon
        let weaponAttack = (this.weapons.left != undefined ? this.weapons.left.getAttack() + this.stats[this.weapons.left.getStat()] / 2 : 0) + (this.weapons.right != undefined ? this.weapons.right.getAttack() + this.stats[this.weapons.left.getStat()] / 2 : 0)
        
        // Calculate the lower bound
        let lowerBound = Math.sqrt(weaponAttack) + (3 / 4) * weaponAttack;

        //  Calculate a random damage value within the lower and upper bounds.
        let randAttack = Math.random() * (weaponAttack - lowerBound) + lowerBound

        // Have the enemy take damage with the given attack.
        return enemy.TakeDamage(randAttack)
    }

    // When given damage, use this formula to calculate the damage taken
    TakeDamage(damage) {

        // Calculate the actual damage taken based on armor
        let totalDamage = Math.floor(damage - (this.stats.armor / 2));

        // Reduce user health
        this.stats.currHealth -= totalDamage;

        // Return damage dealt
        return totalDamage;
    }

    // Magic Attack Damage (work in progress function)
    MagicAttack(target, spellPower) {
        return target.TakeMagicDamage(spellPower);
    }
}