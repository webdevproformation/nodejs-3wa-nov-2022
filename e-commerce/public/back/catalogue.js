document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        const id = e.target.href.split("/").at(-1) ;
        fetch( `/admin/catalogue/${id}` , {method : "DELETE"})
            .then(reponse => reponse.json())
            .then((data) => {
                if(data.message === "delete"){
                    window.location.href="/admin/catalogue"
                }
            })
    })
})