const {Router} = require("express")
const Produit = require("../models/produits");

const router = Router();

router.get("/", (req, rep) => {
    rep.render("back/index");
})


router.get("/catalogue", (req, rep) => {
    rep.render("back/catalogue/index");
})

router.get("/catalogue/new", (req, rep) => {
    rep.render("back/catalogue/form");
})

router.post("/catalogue/new", async (req, rep) => {
    let produit = new Produit(req.body);
    try{
        produit = await produit.save()
        rep.redirect("/admin/catalogue")
    }catch(ex){
        rep.redirect("/page-erreur")
    }
})

module.exports = router;