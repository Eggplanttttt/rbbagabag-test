

const path = require("path");
const express = require("express");

const security = require("./middleware/security");
const siteLocals = require("./middleware/siteLocals");
const routes = require("./routes");
const system = require("./controllers/systemController");

const app = express();


app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(security);
app.use(siteLocals);   
app.use(express.urlencoded({ extended: false, limit: "20kb" }));


app.use(express.static(path.join(__dirname, "public"), { maxAge: "1d" }));

app.use(routes);

app.use(system.notFound);
app.use(system.serverError);

module.exports = app;
