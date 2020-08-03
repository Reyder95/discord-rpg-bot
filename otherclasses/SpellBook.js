module.exports = class SpellBook {
    constructor(spells) {
        this.spells = spells;
    }

    Open(botMsg, inCombat, msg) {
        let spellList = '';

        for (let i = 0; i < this.spells.length; i++) 
            spellList += `\n${i+1}. ${this.spells[i].getName()} (SP ${this.spells[i].getSpellpower()}) - ${this.spells[i].getDescription()}`
            
        if (inCombat)
            botMsg.edit(`\`\`\`md\n# ${msg.author.username}'s Spell Book\n${spellList}\`\`\``);
    }

    CastSpell(spellChoice, targets, botMsg, inCombat, spellUser) {
        return new Promise((resolve, reject) => {
            if (this.spells[spellChoice].getType() == 'single') {
                // Base variable for creatures
                let creatures = "";
    
                // For each enemy in our array, display them properly with their rarity, HP, name, and level
                for (let i = 0; i < targets.length; i++)
                    creatures += `${i+1}. [${targets[i].getName()}](${targets[i].getRarity()}) [Level ${targets[i].getLevel()}]\n- Health: ${targets[i].getCurrentHealth()} / ${targets[i].getMaximumHealth()} ${targets[i].getCurrentHealth() <= 0 ? '[DEAD]' : ''}\n`
            
                const filter = (reaction, user) => {
                    return (reaction.emoji.name === '1️⃣' || reaction.emoji.name === '2️⃣' || reaction.emoji.name === '3️⃣' || reaction.emoji.name === '4️⃣') && user.id === this.msg.author.id
                }

                // Sets up a collector with the above filter so we can collect the player's inputs
                const collector = botMsg.createReactionCollector(filter, { time: 900000 })
                
                // When a message is sent, run this command
                collector.on('collect', async (reaction, user) => {
                    this.spells[spellChoice].Use(spellUser, targets[parseInt(reaction.emoji.name) - 1])
                })
            }
        })
        
            
    }
}