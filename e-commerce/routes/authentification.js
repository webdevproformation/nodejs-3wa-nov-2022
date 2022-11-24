const {Router} = require("express")
const passport = require("passport")

const router = Router();

router.get("/connexion" , (req, rep) => {
    rep.render("front/connexion")
})

router.post("/connexion" , passport.authenticate(
        "local" , {
            failureRedirect : "/connexion", 
            successRedirect : "/" 
            // si admin => back office // si on est client Accueil 
        }
))

module.exports = router ;