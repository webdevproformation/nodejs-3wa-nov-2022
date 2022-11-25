const { Router } = require("express")
const { Commande } = require("../models/commande")
const {isValidObjectId} = require("mongoose")

const router = Router();

router.get("/commande" , async (req, rep) => {
    try{
        const commandes = await Commande.find()
        rep.render( "back/commande/index" , { commandes , session: req.session})
    }catch(ex){
        rep.status(500).json({message : "impossible de récupérer les commandes"})
    }  
})

router.get("/commande/update/:id" ,  async (req, rep) => {
    const id = req.params.id ;
    if( ! isValidObjectId(id)) return rep.status(400).json({message : "id commande invalide"})
    try{
        const commande = await Commande.findById(id)
        const titre = `gestion de la commande ${id}`;
        const total = commande.produits.reduce( (cumul , item) => {return cumul + item.quantite * item.prix } , 0)
        rep.render( "back/commande/form-update" , { commande , titre , total , session: req.session})
    }catch(ex){
        rep.status(500).json({message : "impossible d'update la commande "})
    }  
})


module.exports = router ;