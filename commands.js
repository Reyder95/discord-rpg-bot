const Discord = require('discord.js');
const database = require('./database');
const stats = require('./stat_formulas');
const Items = require('./items');
const Gear = require('./gear/');
const Player = require('./otherclasses/Player');
const Weapons = require('./weapons/');

const commands = {
    /**
     * Shows available commands
     * @param {Discord.Message} msg
     */

     help: async(msg) => {
         const embed = new Discord.MessageEmbed()
         .setTitle('Akuma RPG Help')
         .setDescription('The bot\'s prefix is \'r!\' for each of these commands')  
         .addFields(
             {name: 'register', value: 'Allows you to register your discord account with the bot.'},
             {name: 'profile', value: 'Displays your current level and experience.'},
             {name: 'stats', value: 'Displays your current stats. Health, Armor, STR, INT, and DEX.'},
             {name: 'gear', value: 'Displays your current gear and their rarity.'},
             {name: 'gear <armor slot>', value: 'Inspects a piece of your gear at a specific armor slot (for example: head).'},
             {name: 'inventory', value: 'Displays your inventory with arrows that turn the page.'},
             {name: 'map', value: 'Shows you a list of places that you may go at any time.'},
             {name: 'map <area>', value: 'Allows you to travel to a specific location if you are at an adjoining area.'},
             {name: 'fight', value: 'Initiates a fight at a given area. Only works if the area is not labeled "safe".'},
             {name: 'choice <number>', value: 'Allows you to make a decision in combat regarding the number of the choice.'},
             {name: 'equip <inventory #>', value: 'Allows you to equip a specific item at a specific inventory slot if that item is equippable'},
             {name: 'inspect <inventory #>', value: 'Allows you to inspect a specific item at a specific inventory slot.'}
         )

         msg.channel.send(embed);
     },
    
    // Register the user
    register: async(msg, client) => {

        // Insert the user into the database if they do not already exist
        database.registerUser(msg.author.id)
        .then(() => {
            msg.reply(`You have successfully registered for Akuma RPG.`);    // Reply to them saying they have successfully registered
            
        })
        .catch(() => {
            msg.reply('You are already registered!');    // If they already exist, say they are already registered
        })
    },

    // View your own profile
    profile: async(msg, client) => {

        // Create an embed message that shows the username, profile picture, level, and experience
        const embed = new Discord.MessageEmbed()
        .setTitle(`Profile for ${msg.author.username}`)
        .setThumbnail(msg.author.displayAvatarURL())
        .addField('Level', 1, true)
        .addField('Curr. EXP', 2300, true)
        .addField('EXP Left', 150, true)
        .setColor('#A637AD')

        // Display both embeds one after the other
        msg.channel.send(embed)
    },

    // Allow the user to view their stats
    stats: async(msg) => {
        const embed = new Discord.MessageEmbed()
        .setTitle(`${msg.author.username}'s Stats`)
        .setThumbnail(msg.author.displayAvatarURL())
        .addFields(
            {name: 'Max Health', value: 250, inline: true},
            {name: 'Current Health', value: 180, inline: true},
            {name: 'Armor', value: 35, inline: true},
            {name: 'Strength', value: 15, inline: true},
            {name: 'Dexterity', value: 8, inline: true},
            {name: 'Intelligence', value: 10, inline:true}  
        )
        .setColor('#7C3BA1')

        msg.channel.send(embed);

    },

    // Allow the user to view their gear
    gear: async(msg, client, args) => {

        let equipment = {
            head: "God Helmet"
        }
    
        // If no arguments, display the gear list
        if (args[1] === undefined) {
            // Create an embed message that shows the gear of the user
            const embed = new Discord.MessageEmbed()
            .setTitle(`${msg.author.username}'s Gear`)
            .setThumbnail(msg.author.displayAvatarURL())
            .setDescription('Armor: 35')
            .addFields(
                {name: 'Head', value: 'God Helmet [C]'},
                {name: 'Body', value: 'Chestplate of the Sea [UC]'},
                {name: 'Legs', value: 'Wasteland Leggings [U]'},
                {name: 'Feet', value: 'Boots of Eternity [R]'},
                {name: 'Earrings', value: 'Brave Earrings [L]'},
                {name: 'Necklace', value: 'Akasha [E]'},
                {name: 'Ring 1', value: 'Daisytown [E]'},
                {name: 'Ring 2', value: 'Ring of the Grandeur [L]'},
                {name: 'Left Hand', value: 'Blaze Sword [C]', inline: true},
                {name: 'Right Hand', value: 'Empty', inline: true}
            )
            .setColor('#5F37AD')
            
            msg.channel.send(embed);
        }

        // If an argument is presented, check if it's valid, then inspect the item at that given slot
        else {

            if (equipment[args[1]] !== undefined) {
                const embed = new Discord.MessageEmbed()
                .setTitle(`${equipment[args[1]]}`)
    
                msg.channel.send(embed);
            }
            else {
                msg.reply('Please specify a proper gear slot!')
            }
            
        }
    },

    // Have a player view their inventory
    inventory: async(msg, client) => {
        let inventory = [];

        const embed = new Discord.MessageEmbed()
        .setTitle(`${msg.author.username}'s Inventory`)
        .setDescription('20 Slots Remaining | Small Backpack')

        msg.channel.send(embed)
    },

    // Allow the player to view the map
    map: async(msg, client, args) => {
        if (args[1] == null)
            msg.channel.send(`View world map`);
        else
            msg.channel.send(`View areas in ${args[1]}`);
    },

    // Initiate a fight
    fight: async(msg, client) => {
        let playerGear = []
        
        let playerWeapons = {
            left: new Weapons["WoodenRapier"]
        }

        playerGear.push(new Gear["WoodenHelmet"]());
        playerGear.push(new Gear["IronChestplate"]());

        let player = new Player(250, 250, playerGear, playerWeapons, 10);


        player.Attack('bob')
    },

    // Allow a player to make a choice in a fight
    choice: async(msg, client) => {
        msg.channel.send(`Make a fighting choice!`);
    },

    equip: async(msg, client, args) => {
        msg.channel.send(`Equipping item in inventory slot ${args[1]}`)
    }
}

// Run the command based on the comName given
const run = async (comName, msg, client) => {
    console.log(`Command: ${comName} | User ID: ${client.user.id}`);

    let com = commands[comName];

    return com(msg, client, msg.content.split(' '));
}

module.exports = {
    commands, run
}