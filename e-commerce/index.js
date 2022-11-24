const express = require("express");
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

// routes
app.use("/" , require("./routes/front"))
app.use("/" , require("./routes/authentification"));
app.use("/admin" , require("./routes/back"))

app.listen( PORT , () => console.log(`express start on ${PORT}`) )