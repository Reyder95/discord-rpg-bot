const Enums = require('../../helpers/enums')

module.exports = class Goblin extends require('./EnemyBase') {
    constructor() {
        super();

        this.name = "Goblin";
        this.description = "A creature that creeps through the swampy jungles.";
        this.level = 1;
        this.rarity = Enums.RARITY.COMMON
        this.spellbook = null;
        this.weapons = null;
        this.attackCount = 1;

        this.stats = {
            armor: 15,
            maxHealth: 350,
            currHealth: 350,
            spellResist: 5,
            strength: 100 * this.level / 25,
            dexterity: 100 * this.level / 25,
            intelligence: 100 * this.level / 25,
            baseAttack: Math.floor(50 + this.level * ((3/4) * this.level))
        }
    }
}