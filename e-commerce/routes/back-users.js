const { Router } = require("express")
const { User } = require("../models/user")
const { Commande } = require("../models/commande")
const { isValidObjectId } = require("mongoose")


const router = Router()

router.get("/user" , async (req, rep ) => {
    try{
        const users = await User.find()
        rep.render("back/users/index", {users , session : req.session})
    }catch(ex){
        rep.status(400).json({message : "une erreur s'est produite"})
    }
})

router.delete("/user/:id", async(req, rep) => {
    const id = req.params.id ;
    if(!isValidObjectId(id)) return rep.status(400).json({message : "id invalid"})

    const user = await User.findById(id);

    if(!user) return rep.status(404).json({message : "aucun user trouvé"})


    // si l'utilisateur est un client de base => role === "client"
    // le supprimer ET supprimer toutes les commandes associées cet utilisateur

    if(user.role === "client"){
        // rechercher tous les commandes réalisées par ce user 
        try{
            // supprimer le compte user 
            await User.deleteOne({_id : user._id})
            // supprimer tous les commandes associées 
            await Commande.deleteMany({"client.email" : user.email})
            return rep.json({message : "ok"})
        }catch(ex){
            rep.status(500).json({message : "une erreur s'est produite"})
        }
    }

    if(user.role === "admin"){
        // compter le nombre d'utilisateur qui on un role d'admin 
       const userAdmin =  await User.find({role : "admin"});

       if(userAdmin.length > 1){
        if(id !== req.session.passport.user._id){
           // return rep.json({message : id}); 
            await User.deleteOne({_id : user._id})
            await Commande.deleteMany({"client.email" : user.email})
            return rep.json({message : "ok"})
        }
        return rep.status(400).json({message : "un admin ne peut pas s'auto supprimé"})
       }
        rep.status(400).json({message : "il doit resté au minimum un admin"})
       
    }

})


module.exports = router