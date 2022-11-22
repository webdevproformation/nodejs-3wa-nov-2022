const { Schema , model } = require("mongoose");

const schemaProduit = new Schema({
    nom : String ,
    image : String ,
    Prix : Number ,
    description : String ,
    dt_creation : {type : Date , default : Date.now },
    en_stock : Boolean     
});

const Produit = model("produits" , schemaProduit);

module.exports = Produit ; 