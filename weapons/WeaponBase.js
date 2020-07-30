// Base class for all weapon types

module.exports = class WeaponBase {
    constructor(name, description, attack, stat, rarity, twoHanded, numAttacks) {
        this.name = name;
        this.description = description;
        this.attack = attack;
        this.stat = stat;
        this.rarity = rarity;
        this.twoHanded = twoHanded;
        this.numAttacks = numAttacks;
    }

    getStat() {
        return this.stat;
    }

    getAttack() {
        return this.attack;
    }

    getNumAttacks() {
        return this.numAttacks;
    }

    getRarity() {
        return this.rarity;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }
}