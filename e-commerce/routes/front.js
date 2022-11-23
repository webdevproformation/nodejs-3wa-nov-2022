const { Router } = require("express")
const { Produit } = require("../models/produits")
const { isValidObjectId } = require("mongoose");
const { User , userValidation } = require("../models/user")
const bcrypt = require("bcrypt")

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
        password : passwordHashed
    })
    const result = await user.save();
    rep.json(result)
})

module.exports = router;