const { Router } = require("express")
const { Commande } = require("../models/commande")

const router = Router();

router.get("/commande" , async (req, rep) => {
    try{
        const commandes = await Commande.find()
        rep.render( "back/commande/index" , { commandes , session: req.session})
    }catch(ex){
        rep.status(500).json({message : "impossible de récupérer les commandes"})
    }  
})


module.exports = router ;