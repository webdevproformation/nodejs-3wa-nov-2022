const { Schema , model } = require("mongoose");
const Joi = require("joi")

const schemaProduit = new Schema({
    nom : String ,
    image : String ,
    prix : Number ,
    description : String ,
    dt_creation : {type : Date , default : Date.now },
    en_stock : Boolean     
});

const schemaProduitPanier = new Schema({
    nom : String ,
    image : String ,
    prix : Number ,
    quantite : Number
})

const Produit = model("produits" , schemaProduit);

const validationProduit = Joi.object({
    nom : Joi.string().min(5).required() ,
    image : Joi.string().min(5).required() ,
    prix : Joi.number().greater(0).required() ,
    description : Joi.string().min(5).required() ,
    en_stock : Joi.boolean().required()
})


module.exports = { Produit , validationProduit , schemaProduit , schemaProduitPanier } ; 