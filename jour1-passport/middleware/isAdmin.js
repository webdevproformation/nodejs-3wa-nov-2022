module.exports = function(req, rep, next){

    if(req.user.role === "admin"){
        return next()
    }
    const html = `
        <h1>admin requis</h1>
        <p>vous devez être admin pour accéder à cette page</p>
        <p><a href="/admin">admin</a></p>
    `
    rep.status(401).send(html);

}