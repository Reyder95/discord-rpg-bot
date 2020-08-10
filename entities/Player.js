const formulas = require('../formulas');

// The player character

module.exports = class Player extends require('./EntityBase') {
    constructor(level, spellbook, currentMagicka, currHealth, gear, weapons) {
        super();
        
        this.name = "Player";    // "Name" of player
        this.description = "The player character";    // "Description" of player
        this.level = level;    // Current level of the player
        this.spellbook = spellbook;    // The player's spellbook
        this.gear = gear;    // The gear that the player is wearing
        this.weapons = weapons;    // The weapons the player is wielding
        
        // All of the stats of the player
        this.stats = {
            armor: 0,
            maxHealth: formulas.health(this.level),
            currHealth: currHealth,
            currentMagicka: currentMagicka,
            strength: formulas.stat(this.level),
            dexterity: formulas.stat(this.level),
            intelligence: formulas.stat(this.level),
            baseAttack: formulas.attack(this.level)
        }

        if (gear != null)
            // Buff the stats based on the gear we're using
            for (let i = 0; i < this.gear.length; i++) {
                this.stats[this.gear[i].getBonus().stat] = this.stats[this.gear[i].getBonus().stat] + this.gear[i].getBonus().bonus;
                this.stats.armor += this.gear[i].getArmorBonus();
            }
        
        this.stats.armor = formulas.armor(this.level, this.stats.strength);
        this.stats.spellresist = formulas.spellresist(this.level, this.stats.intelligence);
        this.stats.maximumMagicka = formulas.magicka(this.level, this.stats.intelligence);
    }

    // Uses a certain amount of magicka
    UseMagicka(cost) {
        this.stats.currentMagicka -= cost;
    }

    MagicAttack(target, spellPower) {
        return target.TakeMagicDamage(spellPower);
    }
}