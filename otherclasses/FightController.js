// The controller that handles combat between players and monsters
const Discord = require('discord.js')
const helper = require('../helper');

// Handles the different states battle can be in
const STATES = {
    PLAYER: 0,
    ENEMY: 1,
    WIN: 2,
    LOSE: 3,
    RUN: 4
}

module.exports = class FightController {

    constructor(player, enemies, msg) {
        this.player = player;    // Player object
        this.enemies = enemies;    // Array of enemies (since there can be more than one)
        this.state = null;    // State of the fight, starts at null. Goes between PLAYER and ENEMY until the player wins or loses, then it goes to WIN or LOSE states.
        this.msg = msg;    // We pass in the msg object from discord to display things to the user
        this.enemiesDead = 0;    // Enemy death counter. If this matches the # of enemies there are, we win the fight.
        this.botMsg = null;    // A reference to the message the bot has sent so we can keep editing it.
        this.collector = null;    // A collector member property so we can use the collector from anywhere in the fight
        this.show = false;    // If we want to re-display the combat window, this variable becomes true to handle that.
        
        // The collector filter. Only reactions here will go through to the collector
        this.collectorFilter = (reaction, user) => {
            return (reaction.emoji.name === '1️⃣' || reaction.emoji.name === '2️⃣' || reaction.emoji.name === '3️⃣' || reaction.emoji.name === '4️⃣' || reaction.emoji.name === '⬅') && user.id === this.msg.author.id
        }

        // Display object. Helps us neatly display all the things the user has to know during the fight
        this.display = {   
            playerStats: null,    // Displays the user's stats
            creatures: null,    // Displays the creature's stats and how many there are
            actionsTaken: null,    // A compiled list of all the actions taken during that fight
            chooseAction: "# Choose An Action\n\n" +    // A list of actions a user can take
                          "1. Basic Attack < Attacks with a basic weapon >\n" +
                          "2. Spell Book < Look through the spells you know and cast one >\n" +
                          "3. Item [NOT IMPLEMENTED] < Use an item to give you an advantage >\n" +
                          "4. Run [NOT IMPLEMENTED] < Run away from the battle (you will lose some money) >"
        }
        
        

    }

    // Initiates the battle. All this does is call the CombatLoop() function, but it's a nice "naming convention" to initiate a battle. Will probably add some sort of
    // "Battle Commenced" thing here
    async Initiate() {
        return new Promise((resolve, reject) => {
            let result;
            result = this.CombatLoop()

            if (result)
                resolve(result)
            else
                reject(result)
        })
    }

    // A function to re-show the combat window.
    Show() {
        this.show = true;    // We want to show the window, so set this to true
        this.collector.stop();    // Stop the current collector to trigger its "end" method and the promise will make it reject, so it will loop around and fall into place.
    }

    // Handles the entirety of combat. Everything happens here until one side is declared a winner
    // States are at the top
    async CombatLoop(show) {
        let back = false;    // If we don't want to change to the next state
        let noMagicka = false;    // If the user doesn't have enough magicka for the previous spell they tried to use

        // While nobody has lost or won, continue looping
        while (this.state != STATES.LOSE && this.state != STATES.WIN && this.state != STATES.RUN) {

            // We don't want to change state if we're moving back to this window from somewhere else. (showing the window or hitting the back button)
            if (!back && !show) {
                this.NextState();    // Switch the state (if we are null, this moves into the player state)
            }
               
            back = false;    // Always double check back is set to false after NextState

            // If it is player's state ...
            if (this.state == STATES.PLAYER) {



                await this.DisplayCombat(noMagicka)    // Display the combat information
                .catch(err => {
                    console.log("Error: " + err)
                })

                noMagicka = false;    // Always make sure noMagicka is false at this point

                await this.PlayerTurn()    // Allow the player to do their turn
                .then(async res => {

                    // Handles the choices the player made. res.choice will hold that
                    switch(res.choice) {

                        // If the user wanted to basic attack...
                        case 'basicAttack':
                            await this.BasicAttack();
                            break;

                        // If the user wanted to view their spellbook...
                        case 'spellBook':
                            await this.SpellBook() 
                            .then(async res => {

                                // If the user didn't press the back button
                                if (res != 'back') {

                                    

                                    // Cast a particular spell that was chosen earlier
                                    let spellObject = await this.player.getSpellBook().CastSpell(res, this.enemies, this.botMsg, this.msg, this.player)
                                    .catch(err => {
                                        console.log(err)
                                        noMagicka = true;    // If this hit, they probably didn't have enough magicka.
                                        back = true;    // Always return back in this case
                                    })

                                    // If the promise was successful and we have a spell object we want to call this.
                                    if (spellObject) {
                                        // Display the ability cast
                                        this.display.actionsTaken += `\n+ ${this.msg.author.username} casted ${spellObject.spellName} and dealt ${spellObject.damageDone} damage.`
                                    
                                        // If enemy died, increase death counter
                                        if (this.enemies[spellObject.target].getStats().currHealth == 0)
                                            this.enemiesDead++;
                                    }
                                    
                                }
                                else {
                                    back = true    // If we're here, we want to go back
                                }
                            })
                            break;

                        case 'item':
                            await this.Item()
                            .then(() => {
                                console.log(`Item done!`)
                            })
                            break;
                    
                        case 'run':    // We want to run away
                            await this.Run()
                            .then(() => {
                                console.log(`State: ${this.state}`)
                            })
                            break;
                    }
                })
                .catch(err => {
                    // If we want to show the combat again, ending the collector will always bring us here (this is why we set this.show to true or false)
                    console.log(err)

                    // If we don't want to show anything
                    if (!this.show)
                        // Display that we forgot to take an action
                        this.display.actionsTaken += `\n* ${this.msg.author.username} forgot to take an action.`
                    else
                        back = true    // If we're just re-displaying the window we don't want any actions to happen so we set this to true
                })
            }
            else if (this.state == STATES.ENEMY)    // Else if it's the enemy's turn
                
                await this.EnemyTurn();    // Allow the enemy to do their turn
        }

        // If we won, display that we killed all of the enemies.
        if (this.state == STATES.WIN) {
            this.display.actionsTaken += `\n+ ${this.msg.author.username} killed all of the enemies.`;
            this.DisplayCombat();
            this.msg.reply('Congratulations, you won the fight!')
        }

        // If we lost, say that we died.
        else if (this.state == STATES.LOSE) {
            this.msg.reply('You died!')
        }

        // If we are running
        else if (this.state == STATES.RUN)
            this.msg.reply(`You've successfully run from the fight`)

    }

    // Travel to the next state
    NextState() {
        
        // If nobody has died yet and the fight is still going on, transfer state between player and enemies
        if (this.enemiesDead < this.enemies.length && this.player.getStats().currHealth > 0) {
            switch(this.state) {
                case null:
                    this.state = STATES.PLAYER
                    break;
                case STATES.PLAYER:
                    this.state = STATES.ENEMY
                    break;
                case STATES.ENEMY:
                    this.state = STATES.PLAYER
                    break;
            }
        }
        else {

            // If the player died, set the state to lose
            if (this.player.getStats().currHealth <= 0)
                this.state = STATES.LOSE;

            // If the enemy died, set the state to win
            else if (this.enemiesDead >= this.enemies.length)
                this.state = STATES.WIN;
        }

        
        
    }

    // Displays all the information the player needs to know
    async DisplayCombat(noMagicka) {

        // Displays the player's states (Health and Armor for now)
        this.display.playerStats = "# Player Stats\n\n" +
                                   `<Health> ${this.player.getStats().currHealth} / ${this.player.getStats().maxHealth}\n` +
                                   `<Armor> ${this.player.getStats().armor}\n` +
                                   `<Magicka> ${this.player.getStats().currentMagicka} / ${this.player.getStats().maximumMagicka}\n`;

        // Displays the enemies that the player is fighting
        this.display.creatures = `\n# ${this.enemies.length} Creatures Appear\n\n`

        // If there are no actions taken during the battle, this means the battle just started, so we set the first action to be the fact the player initiated the fight
        if (this.display.actionsTaken == null)
            this.display.actionsTaken = "\n# Actions\n\n" +
                                        `+ ${this.msg.author.username} initiated the fight.`;
        
        // If we're out of magicka, say that we tried to cast a spell but couldn't.
        if (noMagicka)
            this.display.actionsTaken += `\n+ ${this.msg.author.username} tried to cast a spell but didn't have enough magicka!`

        this.display.creatures += this.DisplayEnemies();    // Add all f these creatures to the display object

        // Output the display completely
        if (!this.botMsg || this.show) {
            this.show = false;    // We want to default set this to false when we're done with it
            
            // If this is our first message or we want to resend the message, create a new message
            this.botMsg = await this.msg.channel.send(`\`\`\`md\n# ${this.msg.author.username}'s Battle\n\n\n${this.display.playerStats} ${this.display.creatures} ${this.display.actionsTaken} \n\n${this.display.chooseAction}\`\`\`\nReact with the choice below to choose an option.`)
        }
        else

            // Otherwise, just edit the current message
            this.botMsg.edit(`\`\`\`md\n# ${this.msg.author.username}'s Battle\n\n\n${this.display.playerStats} ${this.display.creatures} ${this.display.actionsTaken} \n\n${this.display.chooseAction}\`\`\`\nReact with the choice below to choose an option.`);
    }

    // Allows the player to choose an action on their turn
    async PlayerTurn(choice) {

        // Promise to send back so the bot waits for this promise
        return new Promise((resolve, reject) => {

            // Set up a whole bunch of reactions
            this.botMsg.react('1️⃣');
            this.botMsg.react('2️⃣');
            this.botMsg.react('3️⃣');
            this.botMsg.react('4️⃣');
            this.botMsg.react('⬅');

            // Sets up a collector with the above filter so we can collect the player's inputs
            this.collector = this.botMsg.createReactionCollector(this.collectorFilter, { time: 900000 })
    
            let result;    // Basic result variale for the promise

            // When a message is sent, run this command
            this.collector.on('collect', async (reaction, user) => {

                
                // Switch statement determining which choice the player made
                switch(reaction.emoji.name) {
                    case '1️⃣':    // If the player wants to basic attack
                        this.botMsg.edit('Chose `Basic Attack`')

                        // Remove the reaction and then return the promise
                        await helper.removeReaction(this.msg.author.id, this.botMsg, '1️⃣')
                        .then(() => {
                            result = {choice: 'basicAttack'};
                        });
                        break;

                    case '2️⃣':    // If the player wants to view and use a spell in their spellbook
                        this.botMsg.edit('Chose `Spellbook`')

                        // Remove the reaction and then return the promise
                        await helper.removeReaction(this.msg.author.id, this.botMsg, '2️⃣')
                        .then(() => {
                            result = {choice: 'spellBook'};
                        });

                        break;

                    case '3️⃣':
                        this.botMsg.edit('Chose to use an item');

                        await helper.removeReaction(this.msg.author.id, this.botMsg, '3️⃣')
                        .then(() => {
                            result = {choice: 'item'}
                        })
                        break;

                    case '4️⃣':    // If the player wants to run entirely from the fight
                        this.botMsg.edit('Chose to Run');

                        // Remove the reaction and then return the promise
                        await helper.removeReaction(this.msg.author.id, this.botMsg, '4️⃣')
                        .then(() => {
                            result = {choice: 'run'}
                        });
                        break;
                }

                this.collector.stop();
            });

            this.collector.on('end', () => {                    // If we get a successful result, resolve the promise
                    if (result)
                        resolve(result);
                    else    // If we do not, reject the promise
                        reject("No action taken!");
                

            })
        })
    }

    // --- The functions that handle each different combat choice

    // Allow the user to basic attack an enemy of their choice
    BasicAttack() {
        
        return new Promise((resolve, reject) => {
            
            // If we have more than one enemy, choose the enemy you wish to attack
            if (this.enemies.length > 1) {
                this.botMsg.edit(`\`\`\`md\n${this.DisplayEnemies()}\n\n# Please select the # of the enemy you would like to attack.\`\`\``)

                let result;    // Result for the promise
    
                // Sets up a collector with the above filter so we can collect the player's inputs
                this.collector = this.botMsg.createReactionCollector(this.collectorFilter, { time: 900000 })
    
                this.collector.on('collect', (reaction, user) => {
                        let damageDone = this.player.Attack(this.enemies[parseInt(reaction.emoji.name) - 1]);    // Get the proper damage done
    
                        // Add to the actions taken
                        this.display.actionsTaken += `\n+ ${this.msg.author.username} dealt ${damageDone} damage to ${this.enemies[parseInt(reaction.emoji.name) - 1].getName()}`
    
                        // Increment death counter if the enemy died
                        if (this.enemies[parseInt(reaction.emoji.name) - 1].getStats().currHealth <= 0)
                            this.enemiesDead++;
                        
                        result = {yes: 'ok '}    // Random result to always resolve a promise at this state
    
                    this.collector.stop();
                })

                // When the collector ends, go back to the combat loop
                this.collector.on('end', m => {
                    if (result)
                        resolve(result)
                    else
                        reject("No action taken!")
                })
            } else {
                let damageDone = this.player.Attack(this.enemies[0]);    // Get the proper damage done
    
                // Add to the actions taken
                this.display.actionsTaken += `\n+ ${this.msg.author.username} dealt ${damageDone} damage to ${this.enemies[0].getName()}`
                // Increment death counter if the enemy died
                if (this.enemies[0].getStats().currHealth <= 0)
                    this.enemiesDead++;

                    resolve({yes: 'ok'})
            }
            
            

            
        })
            
        
    }

    // Function to handle when the user chooses the spellbook
    SpellBook() {
        
        return new Promise((resolve, reject) => {
            let result;    // Variable to hold promise result
            this.player.getSpellBook().Open(this.botMsg, true, this.msg, this.player);    // Open the player's spellbook

            this.collector = this.botMsg.createReactionCollector(this.collectorFilter, { time: 900000 })    // Open a collector to handle player response
    
            // When a message is sent, run this command
            this.collector.on('collect', async (reaction, user) => {

                // If we aren't trying to move back
                if (reaction.emoji.name != '⬅') {

                    // Edit the message as sort of a "loading"
                    this.botMsg.edit(`Chose to cast ${this.player.getSpellBook().getSpell(parseInt(reaction.emoji.name) - 1).getName()}`)
                    
                    // Remove the reaction and then store the result
                    await helper.removeReaction(this.msg.author.id, this.botMsg, reaction.emoji.name)
                    .then(() => {
                        result = parseInt(reaction.emoji.name) - 1
                    })
                }
                else {
                    // If we wanted to go back, remove the reaction and store the result
                    await helper.removeReaction(this.msg.author.id, this.botMsg, reaction.emoji.name)
                    .then(() => {
                        result = "back";
                    })
                }

                this.collector.stop();
            })

            this.collector.on('end', () => {
                if(result != null)
                    resolve(result);
                else
                    reject(result);
            })

        })
    }

    // Function for handling if the player chooses item
    Item() {
        return new Promise((resolve, reject) => {
            console.log('in item')

            resolve('hi')
        })
    }

    Run() {
        return new Promise((resolve, reject) => {
            this.state = STATES.RUN;

            resolve({choice: 'running'})
        })
    }

    // Displays enemies specifically. Useful when we need to display the enemies the user has to choose from.
    DisplayEnemies() {
        
        
        // Base variable for creatures
        let creatures = "";

        // For each enemy in our array, display them properly with their rarity, HP, name, and level
        for (let i = 0; i < this.enemies.length; i++)
            creatures += `${i+1}. [${this.enemies[i].getName()}](${this.enemies[i].getRarity()}) [Level ${this.enemies[i].getLevel()}]\n- Health: ${this.enemies[i].getStats().currHealth} / ${this.enemies[i].getStats().maxHealth} ${this.enemies[i].getStats().currHealth <= 0 ? '[DEAD]' : ''}\n`
    
        return creatures;
    }

    // Allow the enemies to perform their turn
    EnemyTurn() {
        // For each enemy, attack the player
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].getStats().currHealth > 0) {
                let damageDone = this.enemies[i].Attack(this.player);
                this.display.actionsTaken += `\n- ${this.enemies[i].getName()} dealt ${damageDone} damage to ${this.msg.author.username}`;
            }
        }
    }
}