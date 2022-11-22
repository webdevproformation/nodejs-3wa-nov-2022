const { Router } = require("express")
const { Produit } = require("../models/produits")

const router = Router();

router.get("/", async (req, rep) => {
    const produits = await Produit.find({en_stock : true})
    rep.render("front/index" , { produits });
})


module.exports = router;