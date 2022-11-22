const path = require("path")
const express = require("express")

module.exports = function(app){
    app.set("views", path.join(__dirname ,".." , "views"))
    app.set("view engine", "pug")
    app.use(express.static(path.join(__dirname ,"..", "public")))
}

