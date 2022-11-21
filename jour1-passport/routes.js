const {Router} = require("express");

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
route.post("/inscrire" , (req, rep) => {
    rep.json(req.body)
})
route.get("/connecter" , (req, rep) => {
    const formulaire = `
        <h1>connexion</h1>
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
route.get("/admin" , (req, rep) => {
    rep.send(
        `<h1>Back Office</h1>
        <p>bienvenu dans le back office !!!</p>
        `
    )
})

module.exports = route ;
