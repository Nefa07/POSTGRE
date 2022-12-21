const db = require('../../../../helpers/databases/postgre/db')
const bcrypt = require('bcryptjs');

const getDataUser = async (req) => {
    const page = req.query.page
    const limit = req.query.limit

    let queryCount = await db.query('select count(*) from userr')

    let query = 'select * from userr ORDER BY id DESC'

    if (limit) query += ` LIMIT ${limit}`
    if (page && limit) query += ` OFFSET ${(page - 1) * limit}`

    const getData = await db.query(query)

    const totalPages = Math.ceil(queryCount.rows[0].count / limit);


    const resultObj =
    {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPage: totalPages,
        totalDataInPage: getData.rowCount,
        totalItems: parseInt(queryCount.rows[0].count),
        data: getData.rows
    }

    console.log(resultObj);

    return resultObj
};

const getDataUserById = async (req) => {
    const id = parseInt(req.params.id)
    const getData = async () => await db.query('select * from userr where id =$1', [id])
    return await getData()
}

const register = async (req) => {
    const { username, password } = req.body
    const getData = async () => await db.query('insert into userr (username,pass) values ($1,$2)', [username, password])
    return await getData()
}

const updateUser = async (req) => {
    const id = parseInt(req.params.id);
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 2);
    const updateData = async () => await db.query('update userr set username = $1, pass = $2 where id =$3', [username, hash, id])
    return await updateData()
}

const deleteUser = async req => {
    const id = parseInt(req.params.id)
    const deleteData = async () => await db.query('delete from userr where id = $1', [id])
    return await deleteData()
}

module.exports = {
    getDataUser,
    getDataUserById,
    register,
    updateUser,
    deleteUser
}