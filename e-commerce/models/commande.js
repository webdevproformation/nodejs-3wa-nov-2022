const { Schema , model , Types } = require("mongoose");
const { schemaUserPanier } = require("./user")
const { schemaProduitPanier } = require("./produits")

const schemaCommande = new Schema({
    client : schemaUserPanier , 
    produits : [
        {
            produit : schemaProduitPanier ,
            quantite : Number
        }
    ] ,
    total : Number ,
    livraison : {
        rue : String ,
        cp : Number ,
        ville : String
    },
    dt_creation : {type: Date , default : Date.now}
})

const Commande = model("commandes" , schemaCommande);

module.exports = Commande ;