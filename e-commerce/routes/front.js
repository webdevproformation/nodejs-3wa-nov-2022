const { Router } = require("express")

const router = Router();

router.get("/", (req, rep) => {
    rep.render("front/index");
})


module.exports = router;