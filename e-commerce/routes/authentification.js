const {Router} = require("express")
const passport = require("passport")

const router = Router();

router.get("/connexion" , (req, rep) => {
    rep.render("front/connexion" ,{session : req.session})
})

router.post("/connexion" , passport.authenticate(
        "local" , {
            failureRedirect : "/connexion", 
            successRedirect : "/" 
            // si admin => back office // si on est client Accueil 
        }
))

router.get("/deconnexion" , (req, rep) => {
    req.logout(() => {
        rep.redirect("/connexion");
    })
})

module.exports = router ;