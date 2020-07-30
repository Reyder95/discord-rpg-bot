// The player character for use in combat

module.exports = class Player {
    constructor(maxHealth, currHealth, gear, weapons, level) {
        this.maxHealth = maxHealth;
        this.currHealth = currHealth;
        this.stats = {
            strength: 100 * level / 25,
            dexterity: 100 * level / 25,
            intelligence: 100 * level / 25
        }
        this.gear = gear;
        this.weapons = weapons;

        // Buff the stats based on the gear we're using
        for (let i = 0; i < this.gear.length; i++)
            this.stats[this.gear[i].getBonus().stat] = this.stats[this.gear[i].getBonus().stat] + this.gear[i].getBonus().bonus;
    }

    // Attack a given entity
    Attack(enemy) {
        console.log(this.gear[0].getBonus().stat)
        console.log(this.gear[0].getBonus().bonus)
        console.log('Stats: ')
        console.log(`Intelligence: ${this.stats["intelligence"]}`)
        console.log(`Strength: ${this.stats["strength"]}`)
        console.log(`Dexterity: ${this.stats["dexterity"]}`)

        let weaponAttack = (this.weapons.left != undefined ? this.weapons.left.getAttack() + this.stats[this.weapons.left.getStat()] / 2 : 0) + (this.weapons.right != undefined ? this.weapons.right.getAttack() + this.stats[this.weapons.left.getStat()] / 2 : 0)
        enemy.TakeDamage(weaponAttack)
    }

    // When given damage, use this formula to calculate the damage taken
    TakeDamage(damage) {
        health -= damage / armor
    }
}