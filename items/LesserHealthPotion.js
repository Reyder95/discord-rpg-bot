// A basic health potion

module.exports = class LesserHealthPotion extends require('./itemBase') {

    constructor() {
        super()
        this.name = 'Lesser Health Potion';
        this.description = 'A beginner friendly Health Potion.'
    }

    // On use, heal the user
    Use(user, targets) {
        user.Heal(25);
    }
}