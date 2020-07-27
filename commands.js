const Discord = require('discord.js');
const database = require('./database');
const stats = require('./stat_formulas');

const commands = {
    /**
     * Shows available commands
     * @param {Discord.Message} msg
     */
    
    // Register the user
    register: async(msg, client) => {

        // Insert the user into the database if they do not already exist
        database.registerUser(msg.author.id)
        .then(() => {
            msg.reply(`You have successfully registered for Discord RPG.`);    // Reply to them saying they have successfully registered
            
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
        .addField('Experience', 2300, true)
        .addField('Joined', '8/5/2020', true)
        .setColor('#53998C')

        const embed3 = new Discord.MessageEmbed()
        .setTitle(`${msg.author.username}'s Stats`)
        .addFields(
            {name: 'Max Health', value: 250, inline: true},
            {name: 'Current Health', value: 180, inline: true},
            {name: 'Armor', value: 35, inline: true},
            {name: 'Strength', value: 15, inline: true},
            {name: 'Dexterity', value: 8, inline: true},
            {name: 'Intelligence', value: 10, inline:true}
        )

        // Create an embed message that shows the gear of the user
        const embed2 = new Discord.MessageEmbed()
        .setTitle(`${msg.author.username}'s Gear`)
        .addField('Head', 'God Helmet')
        .addField('Body', 'Chestplate of the Sea')
        .addField('Legs', 'Wasteland Leggings')
        .addField('Feet', 'Boots of Eternity')
        .addField('Earrings', 'Brave Earrings')
        .addField('Necklace', 'Akasha')
        .addField('Ring 1', 'Daisytown')
        .addField('Ring 2', 'Ring of the Grandeur')
        .addField('Left Hand', 'Blaze Sword')
        .addField('Right Hand', 'Empty')
        .setColor('#826799')

        // Display both embeds one after the other
        msg.channel.send(embed)
        msg.channel.send(embed3)
        msg.channel.send(embed2)
    },

    // Have a player view their inventory
    inventory: async(msg, client) => {
        const embed = new Discord.MessageEmbed()
        .setTitle(`${msg.author.username}'s Inventory`)
        .setDescription('20 Slots Remaining | Small Backpack')
        .addField('[1] Harpoon', 'Strong weapon used also as a way to catch fish (I think lol wtf)')
        .addField('[2] Chainmail Leggings', 'Very sturdy armor used by infantry to take quite a beating.')
        .addField('[3] Kraznir', 'Incredible blade wielded by the gods. Incinerates all that stand in its way. Can bake a MEAN pie though.')
        .addField('[4] Wooden Spear', 'A simple spear, good for starting out.')

        msg.channel.send(embed)
    },

    map: async(msg, client, args) => {
        if (args[1] == null)
            msg.channel.send(`View world map`);
        else
            msg.channel.send(`View areas in ${args[1]}`);
    },

    fight: async(msg, client) => {
        msg.channel.send(`Fight an enemy!`);
    },

    choice: async(msg, client) => {
        msg.channel.send(`Make a fighting choice!`);
    },

    equip: async(msg, client, args) => {
        msg.channel.send(`Equipping item in inventory slot ${args[1]}`)
    }
}

const run = async (comName, msg, client) => {
    console.log(`Command: ${comName} | User ID: ${client.user.id}`);

    let com = commands[comName];

    return com(msg, client, msg.content.split(' '));
}

module.exports = {
    commands, run
}