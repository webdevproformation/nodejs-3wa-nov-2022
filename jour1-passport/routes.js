const {Router} = require("express");
const  { User } = require("./model-user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passport = require("passport")

const route = Router();

route.get("/inscrire" , (req, rep) => {
    const formulaire = `
        <h1>inscription</h1>
        <form method="POST" action="/inscrire">
            <input type="email" name="email" placeholder="votre@email.fr">
            <br>
            <input type="password" name="password" placeholder="votre password">
            <br>
            <input type="submit" value="créer un nouveau profil">   
        </form>
    `;
    rep.send(formulaire)
})
route.post("/inscrire" , async (req, rep) => {
    const schemaUser = Joi.object({
        email : Joi.string().email({ tlds : {allow :false} }).required(),
        password : Joi.string().min(5).required()
    })

    try{

        const {error} = schemaUser.validate(req.body , { abortEarly : false })

        if(error) return rep.status(400).json(error)

        /**vérifier que l'email n'existe pas déjà en base de donnée */

        const userDoublon = await User.findOne({email : req.body.email})

        if(userDoublon) return rep.status(400).json({message : `l'email ${req.body.email} est déjà utilisé`}); 

        const salt = await bcrypt.genSalt(10); // géréner un salt token qui permet de hashed le mot de passe
        const passwordHashed = await bcrypt.hash( req.body.password , salt ) ;

        const profilUser = {
            email : req.body.email ,
            password : passwordHashed ,
            salt : salt 
        }

        const nouveauProfilUser = new User(profilUser)
        await nouveauProfilUser.save()
       
        rep.redirect("/connecter")
    }
    catch(ex){
        rep.json({erreur : ex})
    }    
})

route.get("/connecter" , (req, rep) => {
    const formulaire = `
        <h1>connexion</h1>
        <form method="POST" action="/connecter">
            <input type="email" name="email" placeholder="votre@email.fr">
            <br>
            <input type="password" name="password" placeholder="votre password">
            <br>
            <input type="submit" value="se connecter">   
        </form>
    `;
    rep.send(formulaire)
})

/* route.post("/connecter" , () => {
    //...
}) */

route.post("/connecter" , passport.authenticate('local' , 
// si on est on a bien saisit des indentifiants correctes et qui existent en base de donnée 
// sinon si c'est KO
{
    successRedirect : "/admin",
    failureRedirect : "/connecter"
}))

route.get("/admin" , (req, rep) => {
    rep.send(
        `<h1>Back Office</h1>
        <p>bienvenu dans le back office !!!</p>
        `
    )
})

module.exports = route ;
