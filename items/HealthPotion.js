// A basic health potion

module.exports = class HealthPotion extends require('./itemBase') {

    constructor() {
        super()
        this.name = 'Health Potion';
        this.description = 'Hi, I\'m a health potion.'
    }

    // On use, heal the user
    Use() {
        console.log('Used Health Potion.')
    }
}