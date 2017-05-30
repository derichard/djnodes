const request = require("request");
require('dotenv').config();

// var urlBase = "https://sso.accounts.dowjones.com/authorize"
// var qs = {
//     scope: "openid given_name family_name email",
//     response_type: "code",
//     redirect_uri: "http://localhost:8000/callback",
//     connection: "dj-oauth",
//     client_id: process.env.CLIENT_ID
// }
// var url = urlBase + "?" + querystring.stringify(qs);
// console.log("authN url:", url);

// request({
//     url: "https://sso.accounts.dowjones.com/oauth/token",
//     method: "POST",
//     json: true,
//     body: {
//         grant_type: "authorization_code",
//         code: code,
//         client_id: process.env.CLIENT_ID,
//         client_secret: process.env.CLIENT_SECRET,
//         redirect_uri: "http://localhost:8000/"
//         }
//     }, (e, r, body) => {
//         if (e || res.statusCode !== 200) {
//             console.log("authN err:", e, "status code:", res.statusCode);
//             console.log("authN err:", body);
//             process.exit();
//         }
//         //console.log(body);
//         var authNtoken = body;
//         console.log("authN token received:", authNtoken);
// });

// var authNtoken = {};
// authNtoken.id_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9FSXpNRGM0UWtJME5VWkdORGs1UTBSRE9VRTNSVEpGTkVReE1EVTFPVVl4TnpnMVF6QXdNZyJ9.eyJpc3MiOiJodHRwczovL3Nzby5hY2NvdW50cy5kb3dqb25lcy5jb20vIiwic3ViIjoiYXV0aDB8YmM1ZGRiODAtODQ1ZS00YTk2LWJjNjItZGMzYTQ0MDNmNGExIiwiYXVkIjoiY1ZhQTRnNzBsMXNoSU1JRk9rRzExbU9OOFhDV0FTb3oiLCJleHAiOjE0OTUzMTc0MDcsImlhdCI6MTQ5NTI4MTQwN30.lRWToJQ28wRTEYRF7Z8jidAYocmyDSYtXMvjySwtdV6Ks6TpzKm65EDtSYR8FNsRXxk9pXm1WV78OaetZIHFFdDGfMGPiMIJLuTIstCitdJx_woE1YZYUiSh5ZbN4OLB-HKyCQ43VhBIuFjZs9mP6jMFxvWlakL6lRkcj11-BnVoKzmfcK7KhvslhAe0e7G2VLUWmaMvpKlVREtEeLs7uq-Ro8qNuf4DAM6oUNfPg0_-dyqy3U2QcZRAk2lCTeFs1C_k6VQgqJGuGY6NC5Xyf9ktrf2MTk6KDsSxEfc4dpeyO791wXqBH0TlrXLRzMCWZw7eYCMBp_V0dPCK-0QoYw"
// console.log(authNtoken);
//
// request({
//     url: "https://sso.accounts.dowjones.com/delegation",
//     method: "POST",
//     json: true,
//     body: {
//         id_token: authNtoken.id_token,
//         client_id: process.env.CLIENT_ID,
//         scope: "openid pib",
//         grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
//         redirect_uri: "http://localhost:8000/"
//         }
//     }, (e, r, body) => {
//         if (e || r.statusCode !== 200) {
//             console.log("authZ err:", e, "status code:", r.statusCode);
//             console.log("authZ err:", body);
//             process.exit();
//         }
//         // console.log(body);
//         var authZtoken = body;
//         console.log("authZ token received:", authZtoken);
// });

var sess = {};
sess.authZtoken = {
    id_token: process.env.id_token
}

search = "twitter";

// request({
//     url: "https://api.dowjones.com/organizations/portfolio-companies/search",
//     headers: {
//         // Accept: "application/json",
//         "content-type": "application/json",
//         Authorization: "Bearer " + sess.authZtoken.id_token
//
//     },
//     method: "POST",
//     json: true,
//     // qs: {
//     //     id_token: sess.authZtoken.id_token
//     // },
//
//     body: {
//         "data": {
//             "type": "portfolio-search",
//             "attributes": {
//               "paging": {
//                 "offset": 0,
//                 "limit": 10
//               },
//               "taxonomy_type": "VentureSource",
//               "parts": [
//                 "LatestRound"
//               ],
//               "filters": {
//                 "company_name": {
//                   "names": [
//                     "twitter"
//                   ],
//                   "search_operator": "Contains"
//                 }
//               }
//             }
//           }
//     }
// }, (e, r, apiBody) => {
//     if (e || r.statusCode !== 200) {
//         console.log("search err:", e, "status code:", r.statusCode);
//         console.log("search err:", apiBody);
//         process.exit();
//     }
//     console.log("search body:", apiBody);
// });
//
// var acc = "Bearer" + sess.authZtoken.id_token
// console.log(acc);

// request({
//     url: "https://api.dowjones.com/organizations/portfolio-companies/53154/executives",
//     headers: {
//         // Accept: "application/json",
//         "content-type": "application/json",
//         Authorization: "Bearer " + sess.authZtoken.id_token
//
//     },
//     method: "GET",
//     json: true,
//     qs: {
//         code_scheme: "EntityId",
//     }
// }, (e, r, apiBody) => {
//     if (e || r.statusCode !== 200) {
//         console.log("search err:", e, "status code:", r.statusCode);
//         console.log("search err:", apiBody);
//         process.exit();
//     }
//     console.log("search body:", apiBody);
//     var executives = apiBody.data;
//     for (var i = 0; i < executives.length; i++) {
//         var p = executives[i];
//         console.log(p.id);
//         console.log(p.attributes);
//         console.log(p.links);
//     }
// });

// function searchPeople(first_name, last_name) {
//     request({
//         url: "https://api.dowjones.com/people/search",
//         headers: {
//             // Accept: "application/json",
//             "content-type": "application/json",
//             Authorization: "Bearer " + sess.authZtoken.id_token
//         },
//         method: "POST",
//         json: true,
//         body: {
//             data: {
//                 "type": "people-search",
//                 "attributes": {
//                     "taxonomy_type": "VentureSource",
//                     "paging": {
//                         "offset": 0,
//                         "limit": 10
//                     },
//                     "sort": "LastName",
//                     "filters": {
//                         "first_name": {
//                             "names": [first_name],
//                             "search_operator": "Contains"
//                         },
//                         "last_name": {
//                             "names": [last_name],
//                             "search_operator": "Contains"
//                         }
//                     }
//                 }
//             }
//         }
//     }, (e, r, apiBody) => {
//         if (e || r.statusCode !== 200) {
//             console.log("search err:", e, "status code:", r.statusCode);
//             console.log("search err:", apiBody);
//             process.exit();
//         }
//         console.log(JSON.stringify(apiBody, null, 4));
//         // var executives = apiBody.data;
//         // for (var i = 0; i < executives.length; i++) {
//         //     var p = executives[i];
//         //     console.log(p.id);
//         //     console.log(p.attributes);
//         //     console.log(p.relationships);
//         //     console.log(p.links);
//         //     console.log();
//         // }
//     });
// }
//
//
//
// function searchCompany(company_name) {
//     request({
//         url: "https://api.dowjones.com/organizations/portfolio-companies/search",
//         headers: {
//             // Accept: "application/json",
//             "content-type": "application/json",
//             Authorization: "Bearer " + sess.authZtoken.id_token
//         },
//         method: "POST",
//         json: true,
//         body: {
//             data: {
//                 "type": "portfolio-search",
//                 "attributes": {
//                     "taxonomy_type": "VentureSource",
//                     "paging": {
//                         "offset": 0,
//                         "limit": 10
//                     },
//                     "filters": {
//                         "company_name": {
//                             "names": [
//                                 company_name
//                             ],
//                             "search_operator": "Contains"
//                         }
//                     }
//                 }
//             }
//         }
//     }, (e, r, apiBody) => {
//         if (e || r.statusCode !== 200) {
//             console.log("search err:", e, "status code:", r.statusCode);
//             console.log("search err:", apiBody);
//             process.exit();
//         }
//         // console.log("search body:", apiBody);
//         console.log(JSON.stringify(apiBody, null, 4));
//         // var executives = apiBody.data;
//         // for (var i = 0; i < executives.length; i++) {
//         //     var p = executives[i];
//         //     console.log(p.id);
//         //     console.log(p.attributes);
//         //     console.log(p.relationships);
//         //     console.log(p.links);
//         //     console.log();
//         // }
//     });
// }

function searchCompany(company_name) {
    request({
        url: "https://api.dowjones.com/organizations/investors/search",
        headers: {
            // Accept: "application/json",
            "content-type": "application/json",
            Authorization: "Bearer " + sess.authZtoken.id_token
        },
        method: "POST",
        json: true,
        body: {
            data: {
                "type": "portfolio-search",
                "attributes": {
                    "taxonomy_type": "VentureSource",
                    "paging": {
                        "offset": 0,
                        "limit": 10
                    },
                    "filters": {
                        "company_name": {
                            "names": [
                                company_name
                            ],
                            "search_operator": "Contains"
                        }
                    }
                }
            }
        }
    }, (e, r, apiBody) => {
        if (e || r.statusCode !== 200) {
            console.log("search err:", e, "status code:", r.statusCode);
            console.log("search err:", apiBody);
            process.exit();
        }
        // console.log("search body:", apiBody);
        console.log(JSON.stringify(apiBody, null, 4));
        // var executives = apiBody.data;
        // for (var i = 0; i < executives.length; i++) {
        //     var p = executives[i];
        //     console.log(p.id);
        //     console.log(p.attributes);
        //     console.log(p.relationships);
        //     console.log(p.links);
        //     console.log();
        // }
    });
}

var first_name = "Bill";
var last_name = "Gates";

// searchPeople(first_name, last_name);

var company_name = "spotify";


searchCompany(company_name);
