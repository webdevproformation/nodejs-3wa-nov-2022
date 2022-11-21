const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const passport = require("passport")
const PORT = 5002;

const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "views"))
app.set("view engine" , "pug")

app.use(express.static(path.join(__dirname, "public")))

app.use(session({
    secret : "secret",
    resave : false ,
    saveUninitialized : false ,
    cookie : {
        maxAge : 1000 * 60* 60
    },
    store : MongoStore.create({
        mongoUrl : process.env.BDD,
        collection : "sessions"
    })
}))

app.use(express.urlencoded({extended : false}));

require("./passpost-config");

app.use(passport.initialize()); // lancer la lib sur les routes
app.use(passport.session()); // liaison avec la session 


app.use("/" , require("./routes"))

app.listen(PORT, function(){
    console.log(`connexion express réussie sur le port ${PORT}`)
})


