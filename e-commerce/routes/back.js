const {Router} = require("express")
const { Produit , validationProduit } = require("../models/produits");
const {isValidObjectId} = require("mongoose");

const router = Router();

router.get("/", (req, rep) => {
    rep.render("back/index");
})


router.get("/catalogue", async (req, rep) => {
    const produits = await Produit.find()
    rep.render("back/catalogue/index" , {produits});
})

router.get("/catalogue/new", (req, rep) => {
    rep.render("back/catalogue/form");
})

router.post("/catalogue/new", async (req, rep) => {

    req.body.en_stock = req.body.en_stock === "1" ? true : false ;

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

router.delete("/catalogue/:id" , async (req, rep) => {
    const id = req.params.id ;
    if( !isValidObjectId(id) ) return rep.status(400).json({message : "id invalid"})
    const produit = await Produit.findById(id);
    if(!produit) return rep.status(404).json({message : "produit inconnu"});
    await Produit.deleteOne(produit);
    rep.json({message : "delete"});
})

module.exports = router;