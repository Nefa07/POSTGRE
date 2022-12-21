const express = require('express')
const dbProduk = require("../../dbProduk")
var produk = express.Router();

produk.get("/product", dbProduk.getProduct)
produk.get("/product/:id",dbProduk.getProductById)
produk.post("/product",dbProduk.addProduct)
produk.put("/product/:id",dbProduk.updateProduct)
produk.delete("/product/:id",dbProduk.deleteProduct)


module.exports = produk


