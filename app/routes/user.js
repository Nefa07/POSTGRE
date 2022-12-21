const express = require('express')
const dbUser = require("../../modules/user/handlers/api_handler")
var usr = express.Router();

usr.get("/listUser", dbUser.getUser)
usr.get("/user/:id",dbUser.getUserById)
usr.post("/register",dbUser.register)
usr.put("/updateUser/:id",dbUser.updateUser)
usr.delete("/deleteUser/:id",dbUser.deleteUser)

module.exports = usr




