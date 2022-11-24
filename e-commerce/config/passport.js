const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const mapper = {
    usernameField : "email",
    passwordField : "password"
}

function verification(username , password , done){
    User.findOne({email : username})
    .then( async (user) => {
        if(!user) return done(null, false) // stop pas d'user avec l'email donné
        const verif = await bcrypt.compare(password , user.password);
        if(verif){
            return done(null , user)
        } else {
            return done(null , false)
        }
    })
}

const strategy = new LocalStrategy( mapper , verification)

passport.use(strategy);

passport.serializeUser((user , done) =>{
    done(null, user)
})
passport.deserializeUser(async(userId, done) => {
    try{
        const user = await User.findById(userId) ;
        done(null, user)
    }catch(ex){
        done(ex)
    }
})

// rdv 14h00 pour la suite et fin de la config de passport !!