const express = require("express");

const app = express()
const PORT = 5000 ;

app.get("/" , (req, rep) => {
    rep.json({ message : "welcome" })
});

app.get("/:id" , (req, rep) => {
    const id = req.params.id ;
    console.log(id)
    const data = [
        {id : 1 , titre : "article 1"},
        {id : 2 , titre : "article 1"}
    ]
    const resultat = data.filter( element => element.id === parseInt(id) )
    rep.json(resultat);
});

app.listen( PORT , () => console.log(`le serveur express ecoute sur le port ${PORT}`) );

