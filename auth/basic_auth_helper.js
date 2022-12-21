const db = require('../helpers/databases/postgre/db');

const findByUsername = async (user) => {
    return await db.query('select username, pass from userr where username = $1', [user])
}

module.exports = {
    findByUsername
}