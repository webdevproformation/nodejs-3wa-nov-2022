const { Schema , model , Types } = require("mongoose");
const { schemaUser } = require("./user")

const schemaCommande = new Schema({
    client : schemaUser , 
    produits : [
        {
            _id  : Types.ObjectId ,
            nom : String ,
            quantite : Number,
            prix : Number,
            total : Number
        }
    ] ,
    total : Number ,
    livraison : {
        _id : Types.ObjectId ,
        rue : String ,
        cp : Number ,
        ville : String
    },
    dt_creation : {type: Date , default : Date.now}
})

const Commande = model("commandes" , schemaCommande);

module.exports = Commande ;