module.exports = class WoodenRapier extends require('./Rapier') {
    constructor() {
        super();

        this.name = "Wooden Rapier";
        this.description = "A basic wooden rapier";
        this.attack = 30;
        this.stat = "dexterity";
        this.rarity = "common";
    }
}