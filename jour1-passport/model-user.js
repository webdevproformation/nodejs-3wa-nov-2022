const { connect , Schema , model } = require ("mongoose")

connect( process.env.BDD , {useNewUrlParser : true})
    .then(() => console.log("connexion bdd réussie"))
    .then((ex) => console.log(ex));

const userSchema = new Schema({
    email : String ,
    password : String,
    salt : String, 
    role : String
});

const User = model("users" , userSchema)

module.exports.User = User ; 