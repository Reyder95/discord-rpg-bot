module.exports = class ItemBase {
    
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    Use(user, targets) {}

    CombatOnly() {}

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    
}