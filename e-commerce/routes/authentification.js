const {Router} = require("express")
const passport = require("passport")
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
 
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

router.post("/connexion-tunnel" , async (req, rep) => {
    User.findOne({email : req.body.email})
    .then( async (user) => {
        if(!user) return rep.json({message : "utilisateur inconnu"}) 
        const verif = await bcrypt.compare(req.body.password , user.password);
        if(verif){
            req.session.passport =  { user : user }  ;
            return rep.redirect("/checkout")
        } else {
            return rep.json({message : "password invalid"})
        }
    })
})



router.get("/deconnexion" , (req, rep) => {
    req.logout(() => {
        rep.redirect("/connexion");
    })
})

module.exports = router ;