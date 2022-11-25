document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click" , e => {
        e.preventDefault()
        const id = e.target.href.split("/").at(-1)
        const options = {method : "DELETE"}
        fetch(`/admin/user/${id}` , options)
            .then(reponse => reponse.json())
            .then((data) => {
                if(data.message === "ok"){
                    window.location.href= "/admin/user"
                }else {
                    console.log(data)
                }
            })
            .catch(ex => console.log(ex))
    })
})