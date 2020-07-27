const Discord = require('discord.js');    // Import Discord.js
const client = new Discord.Client();    // Create a new client
const commands = require('./commands');

// When the client is ready, log to the console
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// When a message is received
client.on('message', msg => {

    // Make sure the author is not a bot, and is also using the correct profile
    if (msg.author.bot || (msg.content[0] !== 'r' && msg.content[1] !== '!'))
        return;

    console.log(`\x1b[36mReceived message:\x1b[0m ${msg.content}`);

    let commandNames = Object.keys(commands.commands);
    let commandArgs = msg.content.split(' ');
    let command = commandArgs[0].slice(2);

    if (commandNames.includes(command))
        commands.run(command, msg, client)
        .catch(error => console.log(`An error has occurred. Error: ${error}.`));
});

client.login('NzM1NDk0OTE5NDEzNTYzMzk0.XxhFFA.TfuJTLhIc8hHixirBZ8QakBOIP4');