document.querySelector("form").addEventListener("submit", e=> {
    e.preventDefault();
    const formData =  new FormData(e.target)
    const produit = Object.fromEntries(formData)
    console.log(produit)
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