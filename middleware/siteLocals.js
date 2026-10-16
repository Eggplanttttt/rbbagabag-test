

const siteModel = require("../models/siteModel");
const Loan = require("../models/loanModel");
const News = require("../models/newsModel");
const fs = require("node:fs");
const path = require("node:path");


function phoneLink(phoneNumber) {
    return "tel:" + String(phoneNumber).replace(/\s/g, "");
}


function asset(path) {
    if (!path || /^(https?:|mailto:|#|\/)/.test(path)) { return path; }
    return "/" + path;
}


function contactLink(subject) {
    return "/contact?subject=" + encodeURIComponent(subject);
}

module.exports = function siteLocals(req, res, next) {
    res.locals.bankInfo = siteModel.bankInfo;
    res.locals.navigationLinks = siteModel.navigationLinks;
    res.locals.footerQuickLinks = siteModel.footerQuickLinks;
    res.locals.menuLoans = Loan.all();
    res.locals.footerNews = News.latest(3);
    res.locals.currentPath = req.path.length > 1 ? req.path.replace(/\/+$/, "") : req.path;

    res.locals.asset = asset;
    res.locals.scriptAsset = function (name) {
        const file = path.join(__dirname, "..", "public", "js", name + ".js");
        return "/js/" + name + ".js?v=" + fs.statSync(file).mtimeMs;
    };
    res.locals.phoneLink = phoneLink;
    res.locals.contactLink = contactLink;

    res.locals.title = siteModel.bankInfo.shortName;
    res.locals.description = siteModel.bankInfo.name + " - your trusted local bank since 1968.";
    res.locals.pageCss = [];
    res.locals.pageJs = [];
    next();
};
