module.exports = class Rapier extends require('./WeaponBase') {
    constructor(name, description, attack, stat, rarity) {
        super();
        
        this.name = name;
        this.description = description;
        this.attack = attack;
        this.stat = stat;
        this.rarity = rarity;
        this.numAttacks = 2;
        this.twoHanded = false;
    }

    
}