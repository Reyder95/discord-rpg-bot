module.exports = class WoodenHelmet extends require('./GearBase') {
    constructor() {
        super();

        this.name = "Wooden Helmet";
        this.description = "One of the most basic pieces of equipment a warrior can use.";
        this.hasEffect = false;
        this.rarity = "common";
        this.armorBonus = 3;
        this.stat = "intelligence";
        this.statBonus = 15;
    }
}