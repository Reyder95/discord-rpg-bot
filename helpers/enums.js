// A file to handle all the possible enums that may be needed throughout the project

// Enum that handles the fight state of the fight controller
const FIGHTSTATES = {
    PLAYER: 0,
    ENEMY: 1,
    WIN: 2,
    LOSE: 3,
    RUN: 4
}

const RARITY = {
    COMMON: "Common",
    UNCOMMON: "Uncommon",
    RARE: "Rare",
    EPIC: "Epic",
    LEGENDARY: "Legendary"
}

const SPELLTYPE = {
    SINGLE: 0,
    AOE: 1
}

module.exports = {
    FIGHTSTATES,
    RARITY,
    SPELLTYPE
}