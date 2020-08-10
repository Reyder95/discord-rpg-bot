// The base of an effect

module.exports = class EffectsBase {
    constructor(name, description, amount, rounds) {
        this.name = name;
        this.description = description;
        this.amount = amount;
        this.rounds = rounds;
    }

    Trigger(entity) {}
}