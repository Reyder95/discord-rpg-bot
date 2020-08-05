// File for various functions that may be useful in the future

// Removes a user from a reaction given the user ID, the message, and the reaction itself.
function removeReaction(userId, msg, msgReaction) {

    return new Promise((resolve, reject) => {
        let result;    // Storing the result of the promise in a variable
        const reaction = msg.reactions.cache.get(msgReaction);    // Getting the reaction

        result = reaction.users.remove(userId);    // Remove the user from the reaction

        // Resolve or reject the promise
        if (result)
            resolve(result)
        else
            reject('Something went wrong');
    })

}

module.exports = {
    removeReaction
}