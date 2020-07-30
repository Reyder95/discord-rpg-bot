// Base class for all gear types

module.exports = class GearBase {
    constructor(name, description, hasEffect, rarity, armorBonus, stat, statBonus) {
        this.name = name;
        this.description = description;
        this.hasEffect = hasEffect
        this.rarity = rarity;
        this.armorBonus = armorBonus;
        this.stat = stat;
        this.statBonus = statBonus;
    }

    // Retrieves the bonuses of a particular piece of equipment.
    // Can be used for things like stat scaling or display
    getBonus() {
        return {
            stat: this.stat,
            bonus: this.statBonus
        }
    }
}