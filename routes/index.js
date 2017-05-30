var express = require('express');
var router = express.Router();
// var request = require("request");
var querystring = require('querystring');
var url = require('url');
var limit = require("simple-rate-limiter");
var request = limit(require("request")).to(1).per(10000);
// var RateLimiter = require('limiter').RateLimiter;
// var limiter = new RateLimiter(150, 'hour');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

function hasAuthNtoken(req, res, next) {
    // console.log("starting hasAuthNtoken function");
    var sess = req.session;
    // console.log("sess:", sess);
    // sess.authNtoken = {
    //     id_token: process.env.authN
    //     };
    if (sess.authNtoken !== undefined) {
        return next();
    } else {
        res.redirect("/login");
    }
}

function hasAuthZtoken(req, res, next) {
    // console.log("starting hasauthZtoken function");
    var sess = req.session;
    // console.log("sess:", sess);
    // sess.authZtoken = {
    //     id_token: process.env.id_token
    //     };
    //console.log(sess.authZtoken.id_token)
    if (sess.authZtoken !== undefined) {
        return next();
    } else {
        request({
            url: "https://sso.accounts.dowjones.com/delegation",
            method: "POST",
            json: true,
            body: {
                id_token: sess.authNtoken.id_token,
                client_id: process.env.CLIENT_ID,
                scope: "openid pib",
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                redirect_uri: "http://localhost:8000/"
                }
            }, (e, r, authZbody) => {
                if (e || r.statusCode !== 200) {
                    console.log("authZ err:", e, "status code:", r.statusCode);
                    console.log("authZ err:", authZbody);
                    res.redirect("/");
                    // process.exit();
                } else {
                    sess.authZtoken = authZbody;
                    console.log("authZ token received:", sess.authZtoken);
                    res.redirect("/");
                }
            });
    }
}

// router.get('/', hasAuthNtoken, hasAuthZtoken, function(req, res, next) {
//     res.render('test');
// });

router.get('/', hasAuthNtoken, hasAuthZtoken, function(req, res, next) {
    res.render('index', {
        page_name: 'index',
        title: "DJ Nodes"
    });
});

router.get("/login", function(req, res, next) {
    res.render("login", {
        page_name: "login",
        title: "DJ Nodes"
    });
});

router.post("/login", function(req, res, next) {
    var urlBase = "https://sso.accounts.dowjones.com/authorize"
    var qs = {
        scope: "openid given_name family_name email",
        response_type: "code",
        // redirect_uri: "http://localhost:8000/callback",
        redirect_uri: "https://djnodes.herokuapp.com/callback",
        connection: "dj-oauth",
        client_id: client_id
    }
    var url = urlBase + "?" + querystring.stringify(qs);
    // console.log("authN url:", url);
    res.redirect(url);
});

router.get("/logout", function(req, res, next) {
    var sess = req.session;
    sess.authZtoken = undefined;
    sess.authNtoken = undefined;
    res.redirect("/");
});


router.get("/callback*", function(req, res, next) {
    var code = url.parse(req.url, parseQueryString=true).query.code;
    request({
        url: "https://sso.accounts.dowjones.com/oauth/token",
        method: "POST",
        json: true,
        body: {
            grant_type: "authorization_code",
            code: code,
            client_id: client_id,
            client_secret: client_secret,
            // redirect_uri: "http://localhost:8000/"
            redirect_uri: "https://djnodes.herokuapp.com"
            }
        }, (e, r, authNbody) => {
            if (e || r.statusCode !== 200) {
                console.log("authN err:", e, "status code:", r.statusCode);
                console.log("authN err:", authNbody);
                sess.authNtoken = undefined;
                sess.authZtoken = undefined;
                res.redirect("/login");
                // process.exit();
            } else {
                //console.log(body);
                var sess = req.session;
                sess.authNtoken = authNbody;
                console.log("authN token received:", sess.authNtoken);
                res.redirect("/");
            }
        });
});

router.get('/graph', hasAuthNtoken, hasAuthZtoken, function(req, res, next) {
    var sess = req.session;
    res.render('graph', {
        page_name: 'graph',
        title: "DJ Nodes"
    });
});

router.get("/api/search/people*", hasAuthNtoken, hasAuthZtoken, function(req, res, next) {
    var sess = req.session;
    var search = url.parse(req.url, parseQueryString=true).query;
    request({
        url: "https://api.dowjones.com/people/search",
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + sess.authZtoken.id_token
        },
        method: "POST",
        json: true,
        body: {
            data: {
                "type": "people-search",
                "attributes": {
                    "taxonomy_type": "VentureSource",
                    "paging": {
                        "offset": search.offset,
                        "limit": 50
                    },
                    "sort": "LastName",
                    "filters": {
                        "first_name": {
                            "names": [search.firstName],
                            "search_operator": "Contains"
                        },
                        "last_name": {
                            "names": [search.lastName],
                            "search_operator": "Contains"
                        }
                    }
                }
            }
        }
    }, (e, r, apiData) => {
        if (e || r.statusCode !== 200) {
            console.log("search err:", e, "status code:", r.statusCode);
            console.log("api/search err:", apiData);
            sess.authNtoken = undefined;
            sess.authZtoken = undefined;
            res.redirect("/login");
            // process.exit();
        } else {
            // console.log(JSON.stringify(apiData, null, 4));
            res.json(apiData);
        }

    });
});

router.get("/api/search/organizations*", hasAuthNtoken, hasAuthZtoken, function(req, res, next) {
    var sess = req.session;
    var search = url.parse(req.url, parseQueryString=true).query;

    var organization = search.organization;
    var type = search.type;
    var data = {
        "attributes": {
            "taxonomy_type": "VentureSource",
            "paging": {
                "offset": search.offset,
                "limit": 50
            }
        }
    };

    switch (type) {
        case "portfolioCompanies":
            data.attributes.filters = {
                    "company_name": {
                        "names": [organization],
                        "search_operator": "Contains"
                    }
            };
            var link = "https://api.dowjones.com/organizations/portfolio-companies/search";
            break;

        case "investors":
            data.attributes.filters = {
                    "company_name": {
                        "names": [organization],
                        "search_operator": "Contains"
                    }
            };
            var link = "https://api.dowjones.com/organizations/investors/search";
            break;

        case "serviceProviders":
            data.type = "service-providers-search";
            data.attributes.filters = {
                    "company_name": {
                        "names": [organization],
                        "search_operator": "Contains"
                    }
            };
            var link = "https://api.dowjones.com/organizations/service-providers/search";
            break;

        case "funds":
            data.type = "funds-search";
            data.attributes.filters = {
                    "fund_name": {
                        "names": [organization],
                        "search_operator": "Contains"
                    }
            };
            var link = "https://api.dowjones.com/organizations/funds/search";
            break;

        case "limitedPartners":
            data.attributes.filters = {
                    "company_name": {
                        "names": [organization],
                        "search_operator": "Contains"
                    }
            };
            var link = "https://api.dowjones.com/organizations/limited-partners/search";
            break;
    }

    request({
        url: link,
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + sess.authZtoken.id_token
        },
        method: "POST",
        json: true,
        body: {
            data: data
        }
    }, (e, r, apiData) => {
        if (e || r.statusCode !== 200) {
            console.log("search err:", e, "status code:", r.statusCode);
            console.log("search err:", apiData);
            res.json(apiData);
            // process.exit();
        } else {
            res.json(apiData);
        }
        // console.log(JSON.stringify(apiData, null, 4));
    });
});

router.get("/api/people", hasAuthNtoken, hasAuthZtoken, function(req, res, next) {
    var sess = req.session;
    var search = url.parse(req.url, parseQueryString=true).query;
    request({
        url: search.link,
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + sess.authZtoken.id_token
        },
        method: "GET",
        json: true,
        body: {
            code_scheme: "EntityId"
        }
    }, (e, r, apiData) => {
        if (e || r.statusCode !== 200) {
            console.log("search err:", e, "status code:", r.statusCode);
            console.log("api/people err:", apiData);
            res.json(apiData);
            // res.redirect("/login");
            // process.exit();
        } else {
            // console.log(JSON.stringify(apiData, null, 4));
            res.json(apiData);
        }
    });
});

router.get("/api/organizations", hasAuthNtoken, hasAuthZtoken, function(req, res, next) {
    var sess = req.session;
    var search = url.parse(req.url, parseQueryString=true).query;
    request({
        url: search.link,
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + sess.authZtoken.id_token
        },
        method: "GET",
        json: true,
        body: {
            code_scheme: "EntityId"
        }
    }, (e, r, apiData) => {
        if (e || r.statusCode !== 200) {
            console.log("search err:", e, "status code:", r.statusCode);
            console.log("api/organizations err:", apiData);
            res.json(apiData);
            // process.exit();
        } else {
            // console.log(JSON.stringify(apiData, null, 4));
            res.json(apiData);
        }
    });
});

module.exports = router;
