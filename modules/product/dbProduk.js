const db = require("./dbConnection")

const responReturn = require("./response/response")

const getProduct = ((request, response) => {

    const responResult = new responReturn();
    db.query("select * from produk Order by id asc", (error, results) => {

        if (error) {
            throw error
        }

        responResult.status = true;
        responResult.code = 200;
        responResult.message = "Success";
        responResult.data = results.rows;

        response.status(200).json(responResult);
    })
})

const getProductById = (request, response) => {
    const responResult = new responReturn();
    const id = parseInt(request.params.id);
    console.log(id);
    db.query('select * from produk where id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rowCount == 0) {
            responResult.status = true,
                responResult.code = 404,
                responResult.message = "user not found",
                responResult.data = null
        } else {
            responResult.status = true,
                responResult.code = 200,
                responResult.message = "sukses",
                responResult.data = results.rows[0]
        }

        response.status(200).json(responResult)
    })
}

const addProduct = (req, res) => {
    const { nama, jumlah } = req.body;
    db.query('insert into produk (nama, jumlah) values ($1,$2)', [nama, jumlah], (error, results) => {
        if (error) {
            throw (error)
        }
        res.status(201).send("produk add")
    })
}

const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const responResult = new responReturn();
    // console.log(id);
    try {
        const { nama, jumlah } = req.body;
        db.query('update produk set nama = $1, jumlah =$2 where id =$3', [nama, jumlah, id], (error, results) => {
            if (error) {
                throw error
            }

            responResult.status = true;
            responResult.code = 200;
            responResult.message = "user modification successed";
            responReturn.data = null;
            res.status(200).send(responResult);
        })
    } catch (error) {
        responResult.status = false;
        responResult.code = 500;
        responResult.message = error.message;
        responResult.data = null;
        res.status(500).json(responResult)
    }
}

const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id);
    db.query('delete from produk where id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send("product has been deleted")
    })
}

module.exports = {
    getProduct,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} 
