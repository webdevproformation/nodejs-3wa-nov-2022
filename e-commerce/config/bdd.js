const { connect } = require("mongoose")

connect( process.env.BDD , { useNewUrlParser : false })
    .then(() => console.log("connexion à MongoDB Atlas réussie"))
    .catch(ex => console.log(ex))