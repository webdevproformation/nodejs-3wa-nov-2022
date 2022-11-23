module.exports = async function(req, rep, next){

    req.session.panier.forEach( async (item) => {
        const produitBdd =  await Produit.findById(item.id)
        panier.push({produitBdd , ...item}) 
        console.log(panier)
    } )
    // bon café rdv 11h15 !!!
}