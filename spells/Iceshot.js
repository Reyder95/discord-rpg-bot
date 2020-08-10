module.exports = class IceShot extends require('./SpellBase') {
    constructor() {
        super();
        this.name = "Ice Shot";
        this.description = "Shoots a shard of ice at a target.";
        this.type = "single";
        this.spellpower = 120;
        this.magickaCost = 50
    }
}