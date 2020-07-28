module.exports = class ItemBase {
    
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    Use() {}

    CombatOnly() {}

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    
}