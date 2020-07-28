// Base class for all enemy types.

module.exports = class EnemyBase {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    Attack(player);
}