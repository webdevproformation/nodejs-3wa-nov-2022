const express = require("express");
const passport = require("passport");
const PORT = 5004

require("dotenv").config();
require("./config/bdd");

const app = express();

// middleware
app.use(express.urlencoded({ extended : false}))
app.use(express.json())

// middleware avec config
require("./config/pug")(app);
require("./config/session")(app);
require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/" , require("./routes/front"))
app.use("/" , require("./routes/authentification"));
app.use("/admin" , require("./routes/back"))
app.use("/admin" , require("./routes/back-users"))

app.listen( PORT , () => console.log(`express start on ${PORT}`) )