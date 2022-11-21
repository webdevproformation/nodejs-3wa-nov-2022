const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const { connect , Schema , model } = require ("mongoose")
const PORT = 5002;

const app = express();

connect( process.env.BDD , {useNewUrlParser : true})
    .then(() => console.log("connexion bdd réussie"))
    .then((ex) => console.log(ex));

const userSchema = new Schema({
    login : String ,
    password : String
})

const User = model("users" , userSchema)



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

app.use("/" , require("./routes"))

app.listen(PORT, function(){
    console.log(`connexion express réussie sur le port ${PORT}`)
})

module.exports = User ; 
