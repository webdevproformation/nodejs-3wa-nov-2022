const { Produit } = require("../models/produits")

module.exports = async (req) => {
    const panier = [];
    
    const getProduit = async (item) => {  
        const produitBdd =  await Produit.findById(item.id)
        panier.push({...produitBdd._doc , ...item , total : item.quantite * produitBdd._doc.prix});
    } 

    const panierComplet = req.session.panier ?   req.session.panier.map( item => getProduit(item) ) : [] ; 
    
    await Promise.all(panierComplet); // attendre que plusieurs requête async soient exécutées pour passer à la suite 
    // Promise.all([ promise , promise ])

    panier.sort((a, b) => {
        const nameA = a.nom.toUpperCase(); // ignore upper and lowercase
        const nameB = b.nom.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });

    // console.log(req.session.panier)
    let total = panier.reduce( (cumul , item) => {
        return cumul + item.total
    } , 0 )

    return [panier , total]
}