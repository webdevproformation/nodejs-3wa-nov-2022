document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click" , e => {
        e.preventDefault();
        const id = e.target.dataset.id ;
        fetch(`/delete/panier/${id}`, {method: "DELETE"})
            .then(reponse => reponse.json())
            .then(data => {
                if(data.message === "ok"){
                    window.location.href = "/checkout"
                }
            })
    })
})

document.querySelectorAll(".moins").forEach(btn => {
    btn.addEventListener("click" , e => {
        e.preventDefault();
        const id = e.target.dataset.id ;
        fetch(`/moins/panier/${id}`, {method: "PUT"})
            .then(reponse => reponse.json())
            .then(data => {
                if(data.message === "ok"){
                    window.location.href = "/checkout"
                }
            })
    })
})

document.querySelectorAll(".plus").forEach(btn => {
    btn.addEventListener("click" , e => {
        e.preventDefault();
        const id = e.target.dataset.id ;
        fetch(`/plus/panier/${id}`, {method: "PUT"})
            .then(reponse => reponse.json())
            .then(data => {
                if(data.message === "ok"){
                    window.location.href = "/checkout"
                }
            })
    })
})