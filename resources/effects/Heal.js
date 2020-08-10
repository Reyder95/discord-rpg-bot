class Heal extends require('./EffectsBase') {
    constructor(amount, rounds) {
        this.name = "Heal";
        this.description = "Heals the user";
        this.amount = amount;
        this.rounds = rounds;
    }
}