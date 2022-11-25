const {Router} = require("express")
const { Produit , validationProduit } = require("../models/produits");
const {isValidObjectId} = require("mongoose");
const upload = require("../middleware/multer")

const router = Router();

router.get("/", (req, rep) => {
    rep.render("back/home", {session : req.session});
})


router.get("/catalogue", async (req, rep) => {
    const produits = await Produit.find()
    rep.render("back/catalogue/index" , {produits , session : req.session});
})

router.get("/catalogue/new", (req, rep) => {
    rep.render("back/catalogue/form",{titre : "créer un nouveau produit", session : req.session});
})

router.post("/catalogue/new", upload.single("image")  ,  async (req, rep) => {

    req.body.en_stock = req.body.en_stock === "1" ? true : false ;
    req.body.image = req.fileName ;

    const {error} = validationProduit.validate(req.body)

    if(error) return rep.json({message : error})

    let produit = new Produit(req.body);
    try{
        produit = await produit.save()
        rep.redirect("/admin/catalogue")
    }catch(ex){
        rep.redirect("/page-erreur")
    }
})

router.get("/catalogue/update/:id", async (req, rep) => {
    const id = req.params.id ;
    if( !isValidObjectId(id) ) return rep.status(400).json({message : "id invalid"})
    const produit = await Produit.findById(id);
    if(!produit) return rep.status(404).json({message : "produit inconnu"});
    rep.render("back/catalogue/form-update" , {produit , titre : "mettre à jour le produit" , session : req.session});
})

router.post("/catalogue/update" , upload.single("image") , async (req, rep) => {
    req.body.en_stock = req.body.en_stock === "1" ? true : false ;

    if( !isValidObjectId(req.body.id) ) return rep.status(400).json({message : "id invalid"})
    const produit = await Produit.findById(req.body.id);
    if(!produit) return rep.status(404).json({message : "produit inconnu"});

    if(req.fileName){
        req.body.image = req.fileName ;
    }else {
        // return rep.json( { produit : produit.image});
        req.body.image = produit.image
        
    }

    delete req.body.id ;

    const {error} = validationProduit.validate(req.body)
    if(error) return rep.json({message : error})
    produit.nom = req.body.nom
    produit.prix = req.body.prix
    produit.description = req.body.description
    produit.en_stock = req.body.en_stock
    produit.image = req.body.image ; 
    await produit.save();
    rep.redirect("/admin/catalogue"); 

})


router.delete("/catalogue/:id" , async (req, rep) => {
    const id = req.params.id ;
    if( !isValidObjectId(id) ) return rep.status(400).json({message : "id invalid"})
    const produit = await Produit.findById(id);
    if(!produit) return rep.status(404).json({message : "produit inconnu"});
    await Produit.deleteOne(produit);
    rep.json({message : "delete"});
})

module.exports = router;