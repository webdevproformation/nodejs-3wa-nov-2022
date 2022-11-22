const express = require("express");
const PORT = 5004
const { connect } = require("mongoose")
require("dotenv").config();

connect( process.env.BDD , { useNewUrlParser : false })
    .then(() => console.log("connexion à MongoDB Atlas réussie"))
    .catch(ex => console.log(ex))


const app = express();

require("./config/pug")(app);

app.use("/" , require("./routes/front"))
app.use("/admin" , require("./routes/back"))


app.listen( PORT , () => console.log(`express start on ${PORT}`) )