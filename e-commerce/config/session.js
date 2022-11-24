const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = function(app){
    
    app.use(session({
        secret : process.env.SECRET_SESSION,
        resave:false,
        saveUninitialized : false ,
        store : MongoStore.create({
            mongoUrl : process.env.BDD,
            collectionName : "sessions"
        }),
        cookie : {
            maxAge : 1000 * 60 * 60 * 24 // durée de vie 24h 
        }
    }))
}