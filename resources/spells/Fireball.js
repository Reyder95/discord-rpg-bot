const Enums = require('../../helpers/enums')

module.exports = class Fireball extends require('./SpellBase') {
    constructor() {
        super();
        this.name = "Fireball";
        this.description = "Hurls a gigantic ball of fire that decimates one foe.";
        this.type = Enums.SPELLTYPE.SINGLE;
        this.spellpower = 100;
        this.magickaCost = 30;
    }
}