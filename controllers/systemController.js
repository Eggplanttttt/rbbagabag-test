
exports.health = function (req, res) {
    res.type("text/plain").send("OK");
};

exports.notFound = function (req, res) {
    res.status(404).render("errors/404", {
        title: "Page not found | Rural Bank of Bagabag"
    });
};

exports.serverError = function (error, req, res, next) {
    console.error(error);
    if (res.headersSent) { return next(error); }
    res.status(error.status || 500).render("errors/500", {
        title: "Something went wrong | Rural Bank of Bagabag"
    }, function (renderError, html) {
        if (renderError) { return res.type("text/plain").send("Something went wrong. Please try again later."); }
        res.send(html);
    });
};
