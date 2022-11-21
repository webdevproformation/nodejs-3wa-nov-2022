const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")

const app = express()
const PORT = 5000 ;

mongoose.connect( process.env.BDD , {useNewUrlParser : true} )
        .then( () => console.log("connexion reussie à la base de données") )
        .catch((ex) => console.log("erreur lors de la connexion à la bdd" , ex))


app.use(session({
    secret : "azerty1234!",
    resave : false ,
    saveUninitialized : false ,
    store : MongoStore.create({
        mongoUrl : process.env.BDD,
        collectionName : "sessions"
    }) ,
    cookie : {
        maxAge: 60 * 60 * 1000
    }
}))


app.get("/" , (req, rep) => {
    req.session.information = "message modifié"
    rep.json({ message : "welcome" })
});

app.get("/:id" , (req, rep) => {
    const id = req.params.id ;
    console.log(id)
    const data = [
        {id : 1 , titre : "article 1"},
        {id : 2 , titre : "article 1"}
    ];
    const messageDansSession = req.session.information
    const resultat = data.filter( element => element.id === parseInt(id) )
    rep.json({
        resultat,
        messageDansSession
    });
    // partager des informations entre les routes via la session
    // au niveau du client ( navigateur web )
});

app.listen( PORT , () => console.log(`le serveur express ecoute sur le port ${PORT}`) );

