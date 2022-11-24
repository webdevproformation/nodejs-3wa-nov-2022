const { Router } = require("express")
const { User } = require("../models/user")


const router = Router()

router.get("/user" , async (req, rep ) => {
    try{
        const users = await User.find()
        rep.render("back/users/index", {users , session : req.session})
    }catch(ex){
        rep.status(400).json({message : "une erreur s'est produite"})
    }
})


module.exports = router