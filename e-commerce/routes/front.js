const { Router } = require("express")
const { Produit } = require("../models/produits")
const { isValidObjectId } = require("mongoose");

const router = Router();

router.get("/", async (req, rep) => {
    const produits = await Produit.find({en_stock : true})
    rep.render("front/index" , { produits });
})

router.get("/produit/:id", async (req, rep) => {
    const id = req.params.id ;
    if(!isValidObjectId(id)) return rep.status(400).json({message : "id invalid"})
    const produit = await Produit.findById(id)
    if(!produit) return rep.status(404).json({message : "aucun produit trouvé"})
    rep.render("front/single" , { produit });
})

router.get("/panier" , (req , rep) => {
    rep.render("front/panier" );
})

// ajouter des produits dans le panier
router.post("/add/panier", (req, rep) => {
    if(!req.session.panier){
        req.session.panier = []
    }
     const produitAModifier = req.session.panier.find( item => item.id === req.body.id )
    // ici // ajouter plus de produits dans le panier 
    if(produitAModifier){
        // augmenter la quantité dans le panier
        const index  = req.session.panier.indexOf(produitAModifier)
        console.log(index);
        req.session.panier[index].quantite += req.body.quantite
    }else {
        // sinon ajouter le produit dans la panier
        req.session.panier.push(req.body);
    } 
    //req.session.panier = [];
    rep.json( req.session.panier );
})

module.exports = router;