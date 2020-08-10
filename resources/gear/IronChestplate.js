const Enums = require('../../helpers/enums')

// A strong earlygame chestplate

module.exports = class IronChestplate extends require('./GearBase') {
    constructor() {
        super();

        this.name = "Iron Chestplate";
        this.description = "A more sturdy type of chestplate. Used in the dwarven mines to combat a more... interesting foe.";
        this.hasEffect = false;
        this.rarity = Enums.RARITY.UNCOMMON;
        this.armorBonus = 10;
        this.stat = "strength";
        this.statBonus = 35;
        this.healthBonus = 20;
    }
}