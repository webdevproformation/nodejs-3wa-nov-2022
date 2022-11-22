const express = require("express");
const PORT = 5004
const path = require("path")


const app = express();

app.set("views", path.join(__dirname , "views"))
app.set("view engine", "pug")

app.use("/" , require("./routes/front"))
app.use("/admin" , require("./routes/back"))


app.listen( PORT , () => console.log(`express start on ${PORT}`) )