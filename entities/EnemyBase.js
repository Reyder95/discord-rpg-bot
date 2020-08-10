module.exports = class EnemyBase extends require('./EntityBase') {
    constructor(name, description, level, armor, currHealth, spellResist, spellbook, weapons, attackCount, rarity) {
        super();
        
        this.name = name;
        this.description = description;
        this.level = level;
        this.rarity = rarity;
        this.spellbook = spellbook;
        this.weapons = weapons;
        this.attackCount = attackCount;    // Number of attacks. 1 if no specials, 4 if all specials.

        this.stats = {
            armor: armor,
            maxHealth: super.getStats().maxHealth,
            currHealth: currHealth,
            spellResist: spellResist,
            strength: super.getStats().strength,
            dexterity: super.getStats().dexterity,
            intelligence: super.getStats().intelligence,
            baseAttack: Math.floor(50 + this.level * ((3/4) * this.level))
        }
    }

    getRarity() {
        return this.rarity;
    }

    AttackA() {}

    AttackB() {}

    AttackC() {}
}