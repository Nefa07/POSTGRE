// const queryHandler = require('../repositories/queries/queries_handler')
const queryHandler = require('../repositories/queries/query')
const responReturn = require("../../../response/response");
const { Query } = require('pg/lib/client');
const jwtAuth = require('../../../auth/jwt_auth_helper')
const db = require('../../../helpers/databases/postgre/db')
const bcrypt = require('bcryptjs');
// 

const { createClient } = require('redis');
const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

const getUser = async (req, res) => {
    // const responResult = new responReturn();
    const token = req.headers['authorization']
    console.log('ini token', token);
    if (token == null) return res.sendStatus(401)
    const user = jwtAuth.authenticateToken(token)
    try {
        const data = await client.get(user.username)
        if (data === token) {

           

            const result = await queryHandler.getDataUser(req)
     

            res.status(200).json(result);
        } else {
            res.status(404).json('authen failed');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json('something broke')
    }
}

const getUserById = async (req, res) => {
    try {
        const token = req.headers['authorization']

        const user = jwtAuth.authenticateToken(token)
        console.log('ini user', user);

        const data = await client.get(user.username)
        console.log('ini data redis', data);
        if (data == token) {
            const result = await queryHandler.getDataUserById(req)
            if (result.rowCount != 0) {
                console.log('ini result', result.rows);
                return res.status(200).json(result.rows)
            } else {
                return res.json('user not found')
            }
        }
        // else if (data != token) {
        //     return res.status(404).json('authorization failed')
        // }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('something broke')
    }
}

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 2);
        await db.query('insert into userr (username,pass) values ($1,$2)', [username, hash])
        res.status(200).json('user registed')
    }
    catch (err) {
        console.log(err);
        res.status(500).json('something broke')
    }
}

const updateUser = async (req, res) => {
    try {
        const token = req.headers['authorization']
        console.log('ini token', token);
        const user = jwtAuth.authenticateToken(token)
        console.log(user);
        const data = await client.get(user.username)
        console.log('ini data', data);
        if (data == token) {
            await queryHandler.updateUser(req)
            res.sendStatus(200)
        }
        else {
            return res.status(404).json('authentication failed')
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('something broke')
    }
}
// trial error
// await db.query('delete from usr where id = $1', [id], (error, results) => {
//     if (error) {
//         throw error
//     }
//     res.status(201).send("user has been deleted")

// const deleteUser = async (req, res) => {
//     const id = parseInt(req.params.id)
//     await db.query('delete from usr where id = $1', [id], (error, results) => {
//         if (error) {
//             throw error
//         }
//         res.status(201).send("user has been deleted")
//     })
// }

const deleteUser = async (req, res) => {
    try {
        const token = req.headers['authorization']
        const user = jwtAuth.authenticateToken(token)
        const data = await client.get(user.username)
        console.log('1', token);
        console.log('2', data);
        if (data == token) {
            queryHandler.deleteUser(req)
            res.status(200).json('delete success')
        } else {
            res.status(404).json('authen failed')
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json('something broke')
    }
}

module.exports = {
    getUser,
    getUserById,
    register,
    updateUser,
    deleteUser
} 
