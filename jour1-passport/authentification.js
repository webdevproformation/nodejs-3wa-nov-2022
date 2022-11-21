module.exports = function(req, rep , next){
    if(req.isAuthenticated()){ // ajouté par passport
        return next();
    }else {
        // page spéciale 
        const html = `
            <h1>authentification nécessaire</h1>
            <p>veuillez vous connecter pour accéder à cette page</p>
            <p><a href="/connecter">connexion</a></p>
        `
        rep.status(401).send(html);
    }
}
