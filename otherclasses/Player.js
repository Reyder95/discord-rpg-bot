// The player character for use in combat

module.exports = class Player {
    constructor(maxHealth, currHealth, gear, weapons, level) {
        this.maxHealth = maxHealth;    // A player's total health
        this.currHealth = currHealth;    // A player's current health
        this.armor = 0;    // Default armor is 0, gets calculated at the bottom

        // A player's complete list of stats
        this.stats = {
            strength: 100 * level / 25,
            dexterity: 100 * level / 25,
            intelligence: 100 * level / 25
        }

        this.gear = gear;    // An array of gear that a player may have
        this.weapons = weapons;    // The weapons a player may have (one left one right)

        // Buff the stats based on the gear we're using
        for (let i = 0; i < this.gear.length; i++) {
            this.stats[this.gear[i].getBonus().stat] = this.stats[this.gear[i].getBonus().stat] + this.gear[i].getBonus().bonus;
            this.armor += this.gear[i].getArmorBonus();
        }
            
    }

    getArmor() {
        return this.armor;
    }

    getMaximumHealth() {
        return this.maxHealth;
    }

    getCurrentHealth() {
        return this.currHealth;
    }

    // Attack a given entity
    Attack(enemy) {

        // TODO: Add possibilities for effects

        let weaponAttack = (this.weapons.left != undefined ? this.weapons.left.getAttack() + this.stats[this.weapons.left.getStat()] / 2 : 0) + (this.weapons.right != undefined ? this.weapons.right.getAttack() + this.stats[this.weapons.left.getStat()] / 2 : 0)
        console.log(weaponAttack)
        
        return enemy.TakeDamage(weaponAttack)
    }

    // When given damage, use this formula to calculate the damage taken
    TakeDamage(damage) {
        let totalDamage = damage - (this.armor / 2);
        this.currHealth -= totalDamage;

        return totalDamage;
    }
}