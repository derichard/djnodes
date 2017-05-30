console.log(client_id);

function setCookie(cname, cvalue, exseconds) {
    var d = new Date();
    d.setTime(d.getTime() + exseconds * 1000);
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

try {
    var id_token = window.location.hash.split("&")[1].split("=")[1];
} catch(error) {
    console.log("error:", error);
}

console.log(id_token);

$.ajax({
    url: "https://sso.accounts.dowjones.com/delegation",
    type: 'POST',
    data: {
        id_token: id_token,
        client_id: client_id,
        scope: "openid pib",
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        redirect_uri: "http://localhost:8000/"
    },
    success: function(authZbody) {
        console.log(authZbody);
        var authZtoken = authZbody.id_token;
        var apiData = $.ajax({
          url: "https://api.dowjones.com/people/search",
          type: 'POST',
          headers: {
              "content-type": "application/json",
              "Authorization": "Bearer " + authZtoken
            },
            dataType: "json",
            data: {
                "type": "people-search",
                "attributes": {
                    "taxonomy_type": "VentureSource",
                    "paging": {
                        "offset": 0,
                        "limit": 10
                    },
                    "sort": "LastName",
                    "filters": {
                        "first_name": {
                            "names": ["Bill"],
                            "search_operator": "Contains"
                        },
                        "last_name": {
                            "names": ["Gates"],
                            "search_operator": "Contains"
                        }
                    }
                }
            },
            success: function(apiData) {
                console.log("success:", apiData);
                document.cookie = cookie;
                return apiData;
            },
            error: function(error) {
                console.log("error:", error);
            }
        });
        console.log(apiData);
        setCookie("authZtoken", authZbody.id_token, 35900);
        // var test = getCookie('authZtoken');
        // console.log(test);
        // $(window).attr('location','/')
    }
});
