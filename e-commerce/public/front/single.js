document.querySelector("form").addEventListener("submit", e=> {
    e.preventDefault();
    const produit = {
        id : document.querySelector("#id").value ,
        quantite : document.querySelector("#quantite").valueAsNumber ,
    }
    const optionsPost = {
        method : "POST" , 
        body : JSON.stringify(produit) ,
        headers: {
            "Content-type": "application/json"
        }
        }
    fetch("/add/panier" , optionsPost)
    .then(reponse => reponse.json())
    .then(console.log)

})