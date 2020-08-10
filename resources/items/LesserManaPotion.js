module.exports = class LesserManaPotion extends require('./itemBase') {

    constructor() {
        super()
        this.name = 'Lesser Mana Potion';
        this.description = 'A beginner friendly Mana Potion.'
    }

    // On use, heal the user
    Use(user, targets) {
        user.ManaGain();
    }
}