const express = require("express");
const controller = require("../controllers/loanApplicationController");
const router = express.Router();
router.post("/", express.json({ limit: "8mb" }), controller.submit);
router.use(function (error, req, res, next) {
    if (error.type === "entity.too.large") return res.status(413).json({ error: "The application is too large. Choose a photo up to 5 MB." });
    if (error.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid application data." });
    next(error);
});
module.exports = router;
