module.exports = class Goblin extends require('./EnemyBase') {
    constructor() {
        super();
        this.name = "Goblin";
        this.description = "Wretched creatures. They prowl around their swamp-filled zones waiting for one sorry sap to walk on by before killing their prey."
        
        this.maxHealth = 150;
        this.currHealth = 150;
        this.armor = 20; 

        this.stats = {
            strength: 22,
            dexterity: 38,
            intelligence: 5
        }

        this.level = 2;
        this.weaponAttack = 15 + this.stats["strength"] / 2
        this.rarity = 'Common';
        this.spellresist = 23;
    }
}