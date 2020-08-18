# Discord RPG (discontinued)
**Note: This bot is being changed into an actual game. Repository going up today, being built in the Godot engine. Will still keep this repo for anyone wanting to learn from it**
Welcome to my first Discord bot! This bot is really just for me to tinker with things, but on the off chance people like the bot I'll decide to do more with it.

## Useful Links
- [Trello Roadmap](https://trello.com/b/9392DnNJ/akuma-rpg-roadmap)

## Running The Bot
Anyone can take this code and use it to mess around. Here's how to get started.

### Setting up the environment

**Before this, you should make your own Discord bot on Discord's developer portal. Then you can use that token to use this code on that bot**

- **Clone the repository** (Requires Git installed)

  - Open up a command prompt and navigate to a folder you'd like.
  - Type ```git clone https://github.com/Reyder95/discord-rpg-bot.git <optional folder name>```.
  - Github will proceed to clone the repository for you into the specified folder.
  - Navigate to the folder and type ```npm install``` into the command prompt to install the necessary dependencies.

- **Create a file named .env**

  - .env is a file type that allows you to specify variables that the code can then read in. This allows for us to keep our bot code secret.
  - On the first line of .env write ```BOT_TOKEN=<token>``` where ```<token>``` is your bot's token on Discord's developer portal.

### Database Setup

- **Install PostgreSQL**
  - Pretty self explanatory, don't really need to go over this part. Just make sure it's installed. I personally use pgadmin to do my database management, but you can use anything you want as long as it's PostgreSQL.

- **Create a connectionString.json file**
  - This should go in the route folder along with all your other files. Type in your DB credentials in this way:

  ```
    {
        "host": "localhost",    # Where your DB is hosted
        "port": 5432,    # Port number, default is 5432
        "database": "discordrpg",    # Whatever you named the database in pg
        "user": "postgres",    # Your username (this is default)
        "password": ""    # Whatever you specified as your password
    }
  ```

  - This allows the bot to know your database credentials and connect to the database.

Type ```node app.js``` to run the application (make sure to add your bot to a test server or PM your bot)

