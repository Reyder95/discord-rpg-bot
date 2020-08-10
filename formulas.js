function stat(level) {
    return 25 + ((level - 1) * 2);
}

function health(level) {
    return 100 + ((level - 1) * 25);
}

function attack(level) {
    return 50 + ((level - 1) * 10);
}

function armor(level, strength) {
    return 5 + ((level - 1) * 2) + strength;
}

function spellresist(level, intelligence) {
    return 5 + ((level - 1) * 2) + intelligence;
}

function magicka(level, intelligence) {
    return Math.floor(100 + ((level - 1) * 2) + ((1/4) * intelligence));
}

module.exports = {
    stat,
    health,
    attack,
    armor,
    spellresist,
    magicka
}