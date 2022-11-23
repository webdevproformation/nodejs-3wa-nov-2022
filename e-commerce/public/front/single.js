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
    .then((data) => {
        if(data && data.message){
            document.querySelector(".message").innerHTML = `<div class="alert alert-danger mt-3">la quantité ne peut pas être négative ou null</div>`
            setTimeout(() => {
                document.querySelector(".message").innerHTML = '';
            } , 2000)
        }else {
            document.querySelector(".message").innerHTML = `<div class="alert alert-success mt-3">le produit a été ajouté au panier</div>`
            setTimeout(() => {
                document.querySelector(".message").innerHTML = '';
            } , 2000)
        }
        
    })
    .catch(ex => {
        document.querySelector(".message").innerHTML = `<div class="alert alert-danger mt-3">${ex.message}</div>`
        setTimeout(() => {
            document.querySelector(".message").innerHTML = '';
        } , 2000)
    })

})