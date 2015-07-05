"use strict";

var express = require("express"),

    MeddelareCounters = require("meddelare-counters"),

    extend = require("extend"),

    // TODO: use a package/library instead?
    copyDeep = function() {
        var args = Array.prototype.slice.call(arguments, 0);

        return extend.apply(null, [true, {}].concat(args));
    };



function MeddelareExpress(options) {
    options = options || {};
    this._options = copyDeep(MeddelareExpress._defaultOptions, options);

    // Set logger separately instead of relying on the deep copy.
    this._options.logger = this._options.logger || options.logger || console;

    this._router = new express.Router(this._options.routerOptions);

    this._router.get("/", this._cacheControl.bind(this));
    this._router.get("/", this._getCount.bind(this));
    this._router.use(MeddelareExpress._forbidden);

    // Pass options to MeddelareCounters.
    // Set logger separately instead of relying on the deep copy.
    options.meddelareCounters = options.meddelareCounters || {};
    this._options.meddelareCounters.logger = this._options.meddelareCounters.logger || options.meddelareCounters.logger || this._options.logger;

    this._meddelareCounters = new MeddelareCounters(this._options.meddelareCounters);

    return this;
}

MeddelareExpress.prototype._cacheControl = function(req, res, next) {
    // Setup caching headers (works well with cloudfront)
    res.set("Cache-Control", "max-age=" + this._options.httpCacheTime);

    next();
};



MeddelareExpress.prototype._getCount = function(req, res, next) {
    var self = this,
        url,
        networks,
        nonExistantNetworks;

    // Check to see if any networks were specified in the query.
    if (!req.query.networks) {
        MeddelareExpress._inputErrorAndDie(req, res, next, "You have to specify which networks you want stats for (networks=facebook,twitter,googleplus)");
        return;
    }

    networks = req.query.networks.split(",");

    nonExistantNetworks = self._meddelareCounters.getInvalidNetworks(networks);

    // Stop if any unknown networks have been requested.
    if (nonExistantNetworks.length > 0) {
        MeddelareExpress._inputErrorAndDie(req, res, next, "Unknown network(s) specified: '" + nonExistantNetworks.join("', '") + "'");
    }

    // Check to see if a url was specified in the query, else attempt to use the refer(r)er url.
    if (req.query.url) {
        url = req.query.url;
    } else {
        url = req.header("Referer");

        if (!url) {
            MeddelareExpress._inputErrorAndDie(req, res, next, "You asked for the referring urls stats but there is no referring url, specify one manually (&url=https://example.com/)");
            return;
        }
    }

    self._meddelareCounters.retrieveCounts(url, networks)
        .then(function(results) {
            res.jsonp(results);
            res.end();
        })
        .catch(function(err) {
            self._options.logger.error("self._getCount", "catch", "this._meddelareCounters.retrieveCounts", err);

            MeddelareExpress._serverErrorAndDie(req, res, next, "There was an unknown error.");
        });
};

MeddelareExpress.prototype.getRouter = function() {
    return this._router;
};



MeddelareExpress._defaultOptions = {
    // How many seconds should HTTP requests' results be cached.
    httpCacheTime: 4 * 60,

    routerOptions: {
        caseSensitive: true,
        strict: true,
    },

    meddelareCounters: {},
};

MeddelareExpress._errorAndDie = function(req, res, next, httpStatus, msg) {
    res.status(httpStatus);

    res.jsonp({
        error: msg,
    });

    res.end();
};

MeddelareExpress._inputErrorAndDie = function(req, res, next, msg) {
    MeddelareExpress._errorAndDie(req, res, next, 422, msg);
};

MeddelareExpress._serverErrorAndDie = function(req, res, next, msg) {
    MeddelareExpress._errorAndDie(req, res, next, 500, msg);
};

MeddelareExpress._forbiddenErrorAndDie = function(req, res, next, msg) {
    MeddelareExpress._errorAndDie(req, res, next, 403, msg);
};

MeddelareExpress._forbidden = function(req, res, next) {
    MeddelareExpress._forbiddenErrorAndDie(req, res, next, "Forbidden");
};



module.exports = MeddelareExpress;