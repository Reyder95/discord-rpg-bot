const { resolve, reject } = require("bluebird");
const helper = require('../helper')

module.exports = class SpellBook {
    constructor(spells) {
        this.spells = spells;    // An array of spells in the user's spellbook.
    }

    // Function to display all the spells in a user's spellbook
    Open(botMsg, inCombat, msg, player) {
        let spellList = '';    // Function to hold the display for the spellbook

        // Display the spellbook
        for (let i = 0; i < this.spells.length; i++) 
            spellList += `\n${i+1}. ${this.spells[i].getName()} (SP ${this.spells[i].getSpellpower()}) (MP ${this.spells[i].getMagickaCost()}) - ${this.spells[i].getDescription()}`
        
        // If we are in combat, edit the combat message.
        if (inCombat)
            botMsg.edit(`\`\`\`md\n# ${msg.author.username}'s Spell Book\n<Magicka> ${player.getStats().currentMagicka} / ${player.getStats().maximumMagicka}\n${spellList}\`\`\``);
    }

    getSpell(spellChoice) {
        return this.spells[spellChoice];
    }

    // Cast a particular spell given all the necessary info to do so
    CastSpell(spellChoice, targets, botMsg, msg, spellUser) {
        return new Promise((resolve, reject) => {

            // If the user has enough magicka for the spell we can proceed
            if (spellUser.getStats().currentMagicka >= this.spells[spellChoice].getMagickaCost()) {

                // If it's a single target spell
                if (this.spells[spellChoice].getType() == 'single') {

                    // Base variable for creatures
                    let creatures = "";
                    let result;    // Result for the promise
                
                    // For each enemy in our array, display them properly with their rarity, HP, name, and level
                    for (let i = 0; i < targets.length; i++)
                        creatures += `${i+1}. [${targets[i].getName()}](${targets[i].getRarity()}) [Level ${targets[i].getLevel()}]\n- Health: ${targets[i].getStats().currHealth} / ${targets[i].getStats().maxHealth} ${targets[i].getStats().currHealth <= 0 ? '[DEAD]' : ''}\n`

                    // Filter for reaction collector to know what to react on
                    const filter = (reaction, user) => {
                        return (reaction.emoji.name === '1️⃣' || reaction.emoji.name === '2️⃣' || reaction.emoji.name === '3️⃣' || reaction.emoji.name === '4️⃣' || reaction.emoji.name === '⬅') && user.id === msg.author.id
                    }

                    // Sets up a collector with the above filter so we can collect the player's inputs
                    const collector = botMsg.createReactionCollector(filter, { time: 900000, max: 2 })

                    botMsg.edit(`\`\`\`md\n${creatures}\`\`\``)    // Edit the message displaying the creatures

                    // When a message is sent, run this command
                    collector.on('collect', async (reaction, user) => {

                        // Await the reaction removal and then cast the spell on that specific monster
                        await helper.removeReaction(msg.author.id, botMsg, reaction.emoji.name)
                        .then(async () => {
                            let damageDone = await this.spells[spellChoice].Use(spellUser, targets[parseInt(reaction.emoji.name) - 1])
                    
                            let spellName = this.spells[spellChoice].getName();
                            result = {spellName, damageDone, target: parseInt(reaction.emoji.name) - 1};
                        })
                        collector.stop();
                    })

                    collector.on('end', () => {
                        if (result != null)
                            resolve(result)
                        else
                            reject(result)
                    })

                }
            }
            else {
                reject('nope')
            }
        })
        
            
    }
}