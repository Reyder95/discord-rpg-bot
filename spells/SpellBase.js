module.exports = class SpellBase {
    constructor(name, description, msg, type, spellpower) {
        this.name = name;
        this.description = description;
        this.msg = msg;
        this.type = type;
        this.spellpower = spellpower;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getSpellpower() {
        return this.spellpower;
    }

    getType() {
        return this.type;
    }

    Use(user, target) {}
}