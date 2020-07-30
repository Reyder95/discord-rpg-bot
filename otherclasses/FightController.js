// The controller that handles combat between players and monsters

const Discord = require('discord.js')

// Handles the different states battle can be in
const STATES = {
    PLAYER: 0,
    ENEMY: 1,
    WIN: 2,
    LOSE: 3
}

module.exports = class FightController {

    constructor(player, enemies, msg) {
        this.player = player;    // Player object
        this.enemies = enemies;    // Array of enemies (since there can be more than one)
        this.state = null;    // State of the fight, starts at null. Goes between PLAYER and ENEMY until the player wins or loses, then it goes to WIN or LOSE states.
        this.msg = msg;    // We pass in the msg object from discord to display things to the user
        this.enemiesDead = 0;    // Enemy death counter. If this matches the # of enemies there are, we win the fight.

        // Display object. Helps us neatly display all the things the user has to know during the fight
        this.display = {   
            playerStats: null,    // Displays the user's stats
            creatures: null,    // Displays the creature's stats and how many there are
            actionsTaken: null,    // A compiled list of all the actions taken during that fight
            chooseAction: "# Choose An Action\n\n" +    // A list of actions a user can take
                          "1. Basic Attack < Attacks with a basic weapon >\n" +
                          "2. Spell Book [Not Implemented] < Look through the spells you know and cast one >\n" +
                          "3. Item [NOT IMPLEMENTED] < Use an item to give you an advantage >\n" +
                          "4. Run [NOT IMPLEMENTED] < Run away from the battle (you will lose some money) >"
        }
    }

    // Initiates the battle. All this does is call the CombatLoop() function, but it's a nice "naming convention" to initiate a battle. Will probably add some sort of
    // "Battle Commenced" embed here.
    Initiate() {
        this.CombatLoop()
    }

    // Handles the entirety of combat. Everything happens here until one side is declared a winner
    // States are at the top
    async CombatLoop() {
        
        // While nobody has lost or won, continue looping
        while (this.state != 2 && this.state != 3) {

            this.NextState();    // Switch the state (if we are null, this moves into the player state)

            console.log("State: " + this.state)

            // If it is player's state ...
            if (this.state == 0) {
                await this.DisplayCombat();    // Display the combat information
                await this.PlayerTurn()    // Allow the player to do their turn
                .then(async res => {
                    switch(res.choice) {
                        case 'basicAttack':
                            await this.BasicAttack();
                    }
                })
            }
            else if (this.state == 1)    // Else if it's the enemy's turn
                await this.EnemyTurn();    // Allow the enemy to do their turn
        }

        if (this.state == 2) {
            this.display.actionsTaken += `\n${this.msg.author.username} killed all of the enemies.`;
            this.DisplayCombat();
            this.msg.reply('Congratulations, you won the fight!')
        }
        else if (this.state == 3) {
            this.msg.reply('You died!')
        }

    }

    // Travel to the next state
    NextState() {
        
        if (this.enemiesDead < this.enemies.length && this.player.getCurrentHealth() > 0) {
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
            if (this.player.getCurrentHealth() <= 0)
                this.state = STATES.LOSE;
            else if (this.enemiesDead >= this.enemies.length)
                this.state = STATES.WIN;
        }

        
        
    }

    // Displays all the information the player needs to know
    DisplayCombat() {

        // Displays the player's states (Health and Armor for now)
        this.display.playerStats = "# Your Stats\n\n" +
                                   `<Health> ${this.player.getCurrentHealth()} / ${this.player.getMaximumHealth()}\n` +
                                   `<Armor> ${this.player.getArmor()}\n`;

        // Displays the enemies that the player is fighting
        this.display.creatures = `\n# ${this.enemies.length} Creatures Appear\n\n`

        // If there are no actions taken during the battle, this means the battle just started, so we set the first action to be the fact the player initiated the fight
        if (this.display.actionsTaken == null)
            this.display.actionsTaken = "\n# Actions\n\n" +
                                        `+ ${this.msg.author.username} initiated the fight.`;

        this.display.creatures += this.DisplayEnemies();    // Add all f these creatures to the display object

        // Output the display completely
        this.msg.channel.send("```md\n" + this.display.playerStats + this.display.creatures + this.display.actionsTaken + "\n\n" + this.display.chooseAction + "```\nType `choose #` to choose an option.");
    }

    // Allows the player to choose an action on their turn
    async PlayerTurn() {

        // Promise to send back so the bot waits for this promise
        return new Promise((resolve, reject) => {

            // Filter to only allow messages with "choose" to pass through, as well only working for the person who originally initiated the fight
            const filter = m => m.content.includes('choose') && m.author.id === this.msg.author.id;

            // Sets up a collector with the above filter so we can collect the player's inputs
            const collector = this.msg.channel.createMessageCollector(filter, { time: 900000 })
    
            // When a message is sent, run this command
            collector.on('collect', m => {
                let choices = m.content.split(' ');    // Split "choices" up as an array by space. The actual # chosen should be choices[1]

                let result;    // Basic result variale for the promise
                
                // Switch statement determining which choice the player made
                switch(choices[1]) {
                    case '1':    // If the player wants to basic attack
                        result = {choice: 'basicAttack'};
                        break;
                    case '2':    // If the player wants to view and use a spell in their spellbook
                        collector.stop();
                        break;
                    case '3':    // If the player wants to view and use an item
                        collector.stop();
                        break;
                    case '4':    // If the player wants to run entirely from the fight
                        collector.stop();
                        break;
                }

                // If we get a successful result, resolve the promise
                if (result)
                    resolve(result);
                else    // If we do not, reject the promise
                    reject("No action taken!");
            });
        })
    }

    // Allow the user to basic attack an enemy of their choice
    BasicAttack() {
        
        return new Promise((resolve, reject) => {
            this.msg.channel.send('Choose the number of the enemy you\'d like to attack. [choose #]');

            // Basic filter for "choose" yada yada we know this already
            const filter = m => m.content.includes('choose') && m.author.id === this.msg.author.id;
            let result;

            const collector = this.msg.channel.createMessageCollector(filter, { time: 900000 })

            collector.on('collect', m => {
                let choices = m.content.split(' ');
                result = choices;
                // If our choice is a proper choice
                if (choices[1] <= this.enemies.length) {
                    let damageDone = this.player.Attack(this.enemies[choices[1] - 1]);    // Get the proper damage done

                    // Add to the actions taken
                    this.display.actionsTaken += `\n+ ${this.msg.author.username} dealt ${damageDone} damage to ${this.enemies[choices[1] - 1].getName()}`

                    // Increment death counter if the enemy died
                    if (this.enemies[choices[1] - 1].getCurrentHealth() <= 0)
                        this.enemiesDead++;
                }
                    

                collector.stop();
            })

            // When the collector ends, go back to the combat loop
            collector.on('end', m => {
                if (result)
                    resolve(result)
                else
                    reject("No action taken!")
            })
        })
            
        
    }

    DisplayEnemies() {
        
        
        // Base variable for creatures
        let creatures = "";

        // For each enemy in our array, display them properly with their rarity, HP, name, and level
        for (let i = 0; i < this.enemies.length; i++)
            creatures += `${i+1}. [${this.enemies[i].getName()}](${this.enemies[i].getRarity()}) [Level ${this.enemies[i].getLevel()}]\n- Health: ${this.enemies[i].getCurrentHealth()} / ${this.enemies[i].getMaximumHealth()} ${this.enemies[i].getCurrentHealth() <= 0 ? '[DEAD]' : ''}\n`
    
        return creatures;
    }

    // Allow the enemies to perform their turn
    EnemyTurn() {
        // For each enemy, attack the player
        for (let i = 0; i < this.enemies.length; i++) {
            let damageDone = this.enemies[i].Attack(this.player);
            this.display.actionsTaken += `\n- ${this.enemies[i].getName()} dealt ${damageDone} damage to ${this.msg.author.username}`;
        }
    }
}