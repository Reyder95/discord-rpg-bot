module.exports = class SpellBase {
    constructor(name, description, msg, type, spellpower, magickaCost) {
        this.name = name;
        this.description = description;
        this.msg = msg;
        this.type = type;
        this.spellpower = spellpower;
        this.magickaCost = magickaCost;
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

    getMagickaCost() {
        return this.magickaCost;
    }

    // Use the spell
    Use(user, target) {
        return new Promise((resolve, reject) => {
            user.UseMagicka(this.magickaCost);
            let result = user.MagicAttack(target, this.spellpower);

            if (result)
                resolve(result)
            else
                reject("nope");
        })
        
    }
}