const { Schema , model , Types } = require("mongoose");
const { schemaUserPanier } = require("./user")
const { schemaProduitPanier } = require("./produits")
const Joi = require("joi")


const schemaCommande = new Schema({
    client : schemaUserPanier , 
    produits : [
            schemaProduitPanier 
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

const validationCommande = Joi.object({
    client : Joi.object({
        email : Joi.string().email({ tlds: { allow: false } }).required()
    }).required() ,
    livraison : Joi.object({
        rue : String ,
        cp : Number ,
        ville : String
    }).required() ,
    produits : Joi.array().min(1).required(),
    total : Joi.number().greater(0).required()
})

module.exports = { Commande , validationCommande}  ;