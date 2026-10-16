
const express = require("express");
const home = require("../controllers/homeController");
const pages = require("../controllers/pageController");
const contact = require("../controllers/contactController");
const system = require("../controllers/systemController");

const router = express.Router();

router.get("/health", system.health);

router.get("/", home.index);
router.get("/about", pages.about);
router.get("/ropa", pages.ropa);
router.get("/loans", pages.loans);
router.use("/loan-applications", require("./loanApplications"));
router.get("/deposits", pages.deposits);
router.get("/annual-report", pages.annualReport);

router.get("/contact", contact.show);
router.post("/contact", contact.submit);


router.get(/^\/(?:views\/)?(home|about|ropa|loans|deposits|contact|annual-report)\.html$/, function (req, res) {
    const page = req.params[0] === "home" ? "/" : "/" + req.params[0];
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    res.redirect(301, page + query);
});
router.get("/index.html", function (req, res) { res.redirect(301, "/"); });

module.exports = router;
