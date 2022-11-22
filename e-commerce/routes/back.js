const {Router} = require("express")

const router = Router();

router.get("/", (req, rep) => {
    rep.render("back/index");
})


router.get("/catalogue", (req, rep) => {
    rep.render("back/catalogue/index");
})



module.exports = router;