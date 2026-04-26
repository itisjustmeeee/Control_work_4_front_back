const users = [];

function getUsers() {
    return users;
}

function findUserById(id) {
    return users.find(u => u.id === id);
}

function findUserByUsername(username) {
    return users.find(u => u.username === username);
}

function createUser(user) {
    users.push(user);
    return user;
}

module.exports = {
    getUsers,
    findUserById,
    findUserByUsername,
    createUser
};