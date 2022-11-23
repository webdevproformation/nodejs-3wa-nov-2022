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

router.get("/panier" , async (req , rep) => {
    const panier = []
    
    const getProduit = async (item) => {
        const produitBdd =  await Produit.findById(item.id)
        panier.push({...produitBdd._doc , ...item , total : item.quantite * produitBdd._doc.prix}) 
    }

    const panierComplet = req.session.panier.map( item => getProduit(item) )
    
    await Promise.all(panierComplet); // attendre que plusieurs requête async soient exécutées pour passer à la suite 
    // Promise.all([ promise , promise ])

    panier.sort((a, b) => {
        const nameA = a.nom.toUpperCase(); // ignore upper and lowercase
        const nameB = b.nom.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });


   // console.log(req.session.panier)
    let total = panier.reduce( (cumul , item) => {
        return cumul + item.total
    } , 0 )

    rep.render("front/panier" , { total , panier } );
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