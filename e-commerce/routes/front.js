const { Router } = require("express")
const { Produit } = require("../models/produits")
const { isValidObjectId } = require("mongoose");
const { User , userValidation } = require("../models/user")
const bcrypt = require("bcrypt")
const getPanier = require("../lib/panier");
const livraisonValidation = require("../models/livraison")
const Commande = require("../models/commande") 

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

    const [panier , total] = await getPanier(req)

    rep.render("front/panier" , { total , panier } );
})

router.delete("/delete/panier/:id" , (req, rep) => {
    const id = req.params.id ;
    if(!isValidObjectId(id)) return rep.status(400).json({message : "id invalid"})
    const panierFiltre = req.session.panier.filter( item => item.id !== id )
    req.session.panier = panierFiltre ;
    rep.json({message : "ok"})
})

router.put("/moins/panier/:id" , (req, rep) => {
    const id = req.params.id ;
    if(!isValidObjectId(id)) return rep.status(400).json({message : "id invalid"})
    const produitAReduire = req.session.panier.find( item => item.id === id )
    const index = req.session.panier.indexOf(produitAReduire)
    if(req.session.panier[index].quantite > 1){
        req.session.panier[index].quantite-- ; 
        rep.json({message : "ok"})
    }else {
        const panierFiltre = req.session.panier.filter( item => item.id !== id )
        req.session.panier = panierFiltre ;
        rep.json({message : "ok"})
    }
})

router.put("/plus/panier/:id" , (req, rep) => {
    const id = req.params.id ;
    if(!isValidObjectId(id)) return rep.status(400).json({message : "id invalid"})
    const produitAReduire = req.session.panier.find( item => item.id === id )
    const index = req.session.panier.indexOf(produitAReduire)
        req.session.panier[index].quantite++ ; 
    rep.json({message : "ok"})
})

// ajouter des produits dans le panier
router.post("/add/panier", (req, rep) => {
    //console.log(req.session.panier)
    // return rep.json(req.session.panier) 
    if(!req.session.panier || !Array.isArray(req.session.panier) || req.session.panier[0] === null ){
        req.session.panier = []
    }
    if(req.body.quantite < 1) return rep.status(400).json({message : "la quantité ne peut être négative ou null"});

     const produitAModifier = req.session.panier.find( item => item.id === req.body.id )
    // ici // ajouter plus de produits dans le panier 
    if(produitAModifier){
        // augmenter la quantité dans le panier
        const index  = req.session.panier.indexOf(produitAModifier)
        req.session.panier[index].quantite += req.body.quantite
    }else {
        // sinon ajouter le produit dans la panier
        req.session.panier.push(req.body);
    } 
    //req.session.panier = [];
    rep.json( req.session.panier );
})

// page identification
router.get("/identification" , (req, rep) => {
    rep.render("front/identification")
})

router.post("/add/user" , async (req, rep) => {

    // verifier que l'utilisateur a rempli le formulaire de manière conforme
    const {error} = userValidation.validate(req.body)

    if(error) return rep.status(400).json({message : "formulaire non conforme"})

    // vérifier qu'il n'y a pas un user qui a déjà le même email 
    const userRecherche = await User.findOne({email : req.body.email})

    if(userRecherche) return rep.status(400).json({message : "email déjà utilisé"})

    // hasher le password AVANT de l'insérer en base de données
    const salt = await bcrypt.genSalt(10)
    const passwordHashed = await bcrypt.hash( req.body.password , salt )
    const user = new User({
        email : req.body.email ,
        password : passwordHashed,
        role : "client"
    })
    const result = await user.save();
    req.session.user = result ;
    rep.redirect("/checkout")
})

router.get("/checkout" , async (req, rep) => {
    const [panier , total] = await getPanier(req);
    const user = req.session.user ;
    const livraison = req.session.livraison ? req.session.livraison : {} ;
    rep.render("front/checkout" , { panier , user , total , livraison })
})

router.post("/add/livraison", (req,rep) => {
    
    const {error} = livraisonValidation.validate(req.body);
    if(error) return rep.status(400).json({message : "adresse incorrect"})

    req.session.livraison = req.body 
    
    rep.redirect("/checkout");
} )

router.get("/paiement" , async(req, rep) => {

    const maCommande = {
        client : req.session.user,
        produits : [
            {
                produit : await Produit.findById(req.session.panier[0].id),
                quantite : req.session.panier[0].quantite
            } ,
            {
                produit : await Produit.findById(req.session.panier[1].id),
                quantite : req.session.panier[1].quantite
            } 
        ] ,
        livraison : req.session.livraison,
        total : 6120
    }

    const commande = new Commande (maCommande)
    const resultat = await commande.save();

    rep.json(resultat)
})

module.exports = router;