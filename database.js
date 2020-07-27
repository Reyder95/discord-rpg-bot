const promise = require('bluebird');

const options = {
    promiseLib: promise
}

const pgp = require('pg-promise')(options);
const connectionString = require('./connectionString.json');
const db = pgp(connectionString);

const registerUser = (id) => {

    let hi = db.task(t => {
        return t.none("SELECT * FROM users WHERE discord_id = ${discord_id}", {
            discord_id: id
        })
        .then(user => {
            db.none("INSERT INTO users (discord_id, level, experience) VALUES (${discord_id}, ${level}, ${experience})", {
                discord_id: id,
                level: 1,
                experience: 0
            })
            .then(result => {
                return result;
            })
            .catch(error => {
                console.log(error);
            });
        })
        .catch(error => {
            return Promise.reject('User Exists');
        })
    }); 

    return hi;
    /*
    */
}

module.exports = {
    registerUser
}