// la gestion processus d'authentification 
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy ;
const { User } = require("./model-user");
const bcrypt = require("bcrypt");


const listeChamps = {
    usernameField : "email",
    passwordField : "password"
}

const verif = async (username , password, done   ) => {
    // ici que l'on va réaliser la comparaison entre les champs saisis dans le formulaire et ceux que l'on a mis en base de données 
    try{
        // est ce qu'il y a un user qui existe avec l'email transmis ??

        const user = await User.findOne( {email : username} )

        if(!user) return done(null , false ); // stopper l'exécution => 

        // est ce que le mot de passe transmis est valide ??? 
        bcrypt.compare( password , user.password  , function(error, resultat){
            // si le mot de passe est correct
            console.log(error , resultat);
            if(!error){
                return done(null, user) // ok redirection vers le page d'admin
            }else {
                return done(null , false ); // ko 
            }
        } )
    }catch{
        (ex) => console.log(ex)
    }
}

const strategy = new LocalStrategy( listeChamps , verif );

passport.use(strategy);

passport.serializeUser((user , done) => {
    done(null, user)
});

passport.deserializeUser((userId , done) => {
    User.findById(userId)
        .then(user => done(null , user))
        .catch(ex => done(ex))
});