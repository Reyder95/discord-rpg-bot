module.exports = class Fireball extends require('./SpellBase') {
    constructor() {
        super();
        this.name = "Fireball";
        this.description = "Hurls a gigantic ball of fire that decimates one foe.";
        this.type = "single"
        this.spellpower = 100;
    }

    getSpellpower() {
        return this.spellpower;
    }

    Use(user, target) {
        this.msg.channel.send(`${user.getName()} casts Fireball on ${target.getName()}.`);

        user.MagicAttack(target, this.spellpower);
    }
}