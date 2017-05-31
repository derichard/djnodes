$(document).ready(function() {

//global variables to store data
var tableData = {};
var linkData = {};

// function generateRandomGraph(numberOfNodes){
//     var elements = [];
//     var bg = ["#00b3b3", "#ff6600", "#1a8cff", "#996600", "#9900ff", "#669999", "#000d1a"]
//     for (var i = 0; i < numberOfNodes; i++) {
//         elements.push({
//             data: {
//                 id: i,
//                 level: 0,
//                 bg: bg[Math.floor(Math.random() * bg.length)]
//             }
//         });
//     }
//     for (var i = 0; i < numberOfNodes; )
//     var maxEdges = Math.floor(Math.random() * numberOfNodes * 3);
//     for (var i = 0; i < maxEdges; i++) {
//         var source = Math.floor(Math.random() * numberOfNodes);
//     }
// }

//todo: if using fcodes, handle id properly
var table = $('#results').DataTable({
    // "lengthMenu": [[5, 100, 500, -1], [50, 100, 500, "All"]],
    rowId: "id",
    language: {
        search: "_INPUT_",
        searchPlaceholder: "Filter"
    },
    "order": [
        [3, 'desc']
    ],
    "orderCellsTop": true,
    "dom": "rtip",
    // stateSave: true,
    columns: [{
            data: 'id',
            // "width": "5%",
            "defaultContent": "",
            className: "id",
            "visible": false
        },
        {
            data: 'attributes.fcode',
            // "width": "5%",
            "defaultContent": "",
            className: "fcode",
            "visible": false
        },
        {
            data: 'entity',
            "width": "20%",
            "defaultContent": "",
            className: "entity"
        },
        {
            data: 'type',
            "width": "15%",
            "defaultContent": "",
            className: "type"
        },
        {
            data: 'description',
            // "width": "10%",
            "defaultContent": "",
            className: "description"
        },
        {
            data: 'relations',
            // "width": "20%",
            "defaultContent": "",
            className: "relationships",
            "visible": false
        },
        {
            data: 'links.self',
            // "width": "10%",
            "defaultContent": "",
            className: "self",
            "visible": false
        }
    ]
});

$('#filter').keyup(function(){
      table.search($(this).val()).draw();
});

var cy = cytoscape({
    container: $('#cy'), // container to render in
    "autoWidth": false,
    elements: [
        {
            data: {
                id: 'a',
                type: "intro",
                level: 0,
                bg: "#00b3b3"
            }
        },
        {
            data: {
                id: 'b',
                type: "intro",
                level: 0,
                bg: "#ff6600"
            }
        },
        {
            data: {
                id: 'c',
                type: "intro",
                level: 0,
                bg: "#1a8cff"
            }
        },
        { // edge ab
            data: {
                id: 'ab',
                source: 'a',
                target: 'b'
            },
        },
        { // edge bc
            data: {
                id: 'bc',
                source: 'b',
                target: 'c'
            },
        }
    ],
    layout: {
        name: "random"
    },

    style: [
        {
            selector: 'node',
            style: {
                "height": function (node) {
                    return 20 - 2 * node.data("level");
                },
                "width": function (node) {
                    return 20 - 2 * node.data("level");
                },
                "label": "data(name)",
                "background-color": "data(bg)"
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'opacity': 0.5,
                'curve-style': 'haystack',
                'haystack-radius': 0,
                'line-color': '#20b2aa',
            }
        }
    ]
});

var coseLayout = {
    name: 'cose',
    // Called on `layoutready`
    ready: $('#graphSpinner').hide(),
    // Called on `layoutstop`
    stop: $('#graphSpinner').hide(),
    // Whether to animate while running the layout
    animate: false,
    // The layout animates only after this many milliseconds
    // (prevents flashing on fast runs)
    animationThreshold: 250,
    // Number of iterations between consecutive screen positions update
    // (0 -> only updated on the end)
    refresh: 20,
    // Whether to fit the network view after when done
    fit: true,
    // Padding on fit
    padding: 20,
    // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    boundingBox: undefined,
    // Excludes the label when calculating node bounding boxes for the layout algorithm
    nodeDimensionsIncludeLabels: false,
    // Randomize the initial positions of the nodes (true) or use existing positions (false)
    randomize: true,
    // Extra spacing between components in non-compound graphs
    componentSpacing: 20,
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: function( node ){ return 400000; },
    // Node repulsion (overlapping) multiplier
    nodeOverlap: 100,
    // Ideal edge (non nested) length
    idealEdgeLength: function( edge ){ return 10; },
    // Divisor to compute edge forces
    edgeElasticity: function( edge ){ return 100; },
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 5,
    // Gravity force (constant)
    gravity: 80,
    // Maximum number of iterations to perform
    numIter: 1000,
    // Initial temperature (maximum node displacement)
    initialTemp: 200,
    // Cooling factor (how the temperature is reduced between consecutive iterations
    coolingFactor: 0.95,
    // Lower temperature threshold (below this point the layout will end)
    minTemp: 1.0,
    // Pass a reference to weaver to use threads for calculations
    weaver: false
};

var gridLayout = {
    name: 'grid',

    fit: true, // whether to fit the viewport to the graph
    padding: 30, // padding used on fit
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
    nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    condense: false, // uses all available space on false, uses minimal space on true
    rows: undefined, // force num of rows in the grid
    cols: undefined, // force num of columns in the grid
    position: function( node ){}, // returns { row, col } for element
    sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    ready: $('#graphSpinner').hide(), // callback on layoutready
    stop: $('#graphSpinner').hide() // callback on layoutstop
};

var concentricLayout = {
    name: 'concentric',
    fit: true, // whether to fit the viewport to the graph
    padding: 10, // the padding on fit
    startAngle: 3 / 2 * Math.PI, // where nodes start in radians
    sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
    clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
    equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
    minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
    height: undefined, // height of layout area (overrides container height)
    width: undefined, // width of layout area (overrides container width)
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
      return 10 - node.data('level');
    },
    levelWidth: function( nodes ){ // the variation of concentric values in each level
      return 1;
    },
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    ready: $('#graphSpinner').hide(), // callback on layoutready
    stop: $('#graphSpinner').hide() // callback on layoutstop
};

var coseBilkentLayout = {
    name: "cose-bilkent",
  // Called on `layoutready`
  ready: function () {
      $('#graphSpinner').hide();
  },
  // Called on `layoutstop`
  stop: function () {
      $('#graphSpinner').hide();
  },
  // number of ticks per frame; higher is faster but more jerky
  refresh: 30,
  // Whether to fit the network view after when done
  fit: true,
  // Padding on fit
  padding: 20,
  // Padding for compounds
  paddingCompound: 5,
  // Whether to enable incremental mode
  randomize: true,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 4500,
  // Ideal edge (non nested) length
  idealEdgeLength: 50,
  // Divisor to compute edge forces
  edgeElasticity: 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 0.1,
  // Gravity force (constant)
  gravity: 0.25,
  // Maximum number of iterations to perform
  numIter: 2500,
  // For enabling tiling
  tile: true,
  // Type of layout animation. The option set is {'during', 'end', false}
  animate: 'end',
  // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingVertical: 10,
  // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8
};

function qtipText(node) {

    //little helper to create tags
    function tagText(text, tag) {
        if (typeof text == "undefined") {
            return "<" + tag + ">" + "</" + tag + ">";
        } else {
            return "<" + tag + ">" + text + "</" + tag + ">";
        }
    }

    var nodeData = node.data("fullProfile");
    // console.log("nodeData", nodeData)
    var id = tagText(nodeData.id, "p");

    switch (nodeData.type) {
        case "people":
            var typeShow = tagText("Person", "p");
            var title = tagText(nodeData.attributes.title, "p");
            return tagText(id + typeShow + title, "div");
            break;

        case "portfolio-companies":
            var typeShow = tagText("Portfolio-Company", "p");
            var description = tagText(nodeData.attributes.description, "p");
            if (typeof nodeData.attributes.website == "undefined") {
                var website = "";
            } else {
                var website = "<a href=http://" + nodeData.attributes.website + ">" +
                                nodeData.attributes.website + "</a>";
            }
            return tagText(id + typeShow + description + website, "div");
            break;

        case "investors":
            var typeShow = tagText("Investor", "p");
            var description = tagText(nodeData.attributes.description, "p");
            if (typeof nodeData.attributes.website == "undefined") {
                var website = "";
            } else {
                var website = "<a href=http://" + nodeData.attributes.website + ">" +
                                nodeData.attributes.website + "</a>";
            }
            return tagText(id + typeShow + description + website, "div");
            break;

        case "service-providers":
            var typeShow = tagText("Service-Provider", "p");
            var description = tagText(nodeData.attributes.description, "p");
            if (typeof nodeData.attributes.website == "undefined") {
                var website = "";
            } else {
                var website = "<a href=http://" + nodeData.attributes.website + ">" +
                                nodeData.attributes.website + "</a>";
            }
            return tagText(id + typeShow + description + website, "div");
            break;

        case "funds":
            var typeShow = tagText("Fund", "p");
            var description = tagText(nodeData.attributes.description, "p");
            if (typeof nodeData.attributes.website == "undefined") {
                var website = "";
            } else {
                var website = "<a href=http://" + nodeData.attributes.website + ">" +
                                nodeData.attributes.website + "</a>";
            }
            return tagText(id + typeShow + description + website, "div");
            break;

        case "limited-partners":
            var typeShow = tagText("Limited Partner", "p");
            var description = tagText(nodeData.attributes.description, "p");
            if (typeof nodeData.attributes.website == "undefined") {
                var website = "";
            } else {
                var website = "<a href=http://" + nodeData.attributes.website + ">" +
                                nodeData.attributes.website + "</a>";
            }
            return tagText(id + typeShow + description + website, "div");
            break;

        case "rounds":
            var typeShow = tagText("Round", "p");
            if (typeof nodeData.attributes.currency == "undefined" ||
                typeof nodeData.attributes.currency.code == "undefined" ||
                typeof nodeData.attributes.amount == "undefined") {
                var amount = "";
            } else {
                var amount = tagText(nodeData.attributes.currency.code + " " +
                                        nodeData.attributes.amount, "p");
            }
            return tagText(id + typeShow + amount, "div");
            break;
    }
    return "<div>" + JSON.stringify(node.data("fullProfile"), null, 4) + "</div>"
}

//extract links from apiObj
function extractLinks(apiObj) {
    var links = [];
    var relationships = apiObj.relationships;
    for (var key in relationships) {
        if (relationships.hasOwnProperty(key)) {
            links.push(relationships[key].links.related);
        }
    }
    return links;
}

//converts apiObj "data" to CyEle object
function apiObjToCyEle(apiObj, level, sourceId) {
    // console.log("apiObjToCyEle:", apiObj);
    if (apiObj.links == undefined) {
        apiObj.links = {
            self : null
        }
    }
    var eleObj = {
        data: {
            id: apiObj.id,
            bg: "#000d1a",
            type: apiObj.type,
            name: "",
            level: level,
            link: apiObj.links.self,
            relations: extractLinks(apiObj),
            fullProfile: apiObj
        },
        position: {
            x: 1,
            y: 1
        }
    };
    switch (apiObj.type) {
        case "people":
            eleObj.data.name = apiObj.attributes.name.first_name + " " +
                apiObj.attributes.name.last_name;
            eleObj.data.bg = "#00b3b3"
            break;

        case "investors":
            eleObj.data.name = apiObj.attributes.name.company_name;
            eleObj.data.bg = "#ff6600"
            break;

        case "portfolio-companies":
            eleObj.data.name = apiObj.attributes.name.company_name;
            eleObj.data.bg = "#1a8cff"
            break;

        case "funds":
            eleObj.data.name = apiObj.attributes.name.fund_name;
            eleObj.data.bg = "#996600"
            break;

        case "service-providers":
            eleObj.data.name = apiObj.attributes.name.company_name;
            eleObj.data.bg = "#9900ff"
            break;

        case "limited-partners":
            eleObj.data.name = apiObj.attributes.name.company_name;
            eleObj.data.bg = "#669999"
            break;

        case "rounds":
            eleObj.data.parent = sourceId;
            eleObj.data.name = apiObj.attributes.round_type.description;
            eleObj.data.bg = "#000d1a"
            break;
    }
    // console.log("eleObj after:", eleObj);
    return eleObj;
}

function getObjByLink(link) {
    // console.log("link:", link);
    return new Promise((resolve, reject) => {
        if (link.match(/people/i)) {
            var url = "/api/people";
        } else {
            var url = "/api/organizations"
        }
        $.getJSON(url, {link: link}, function(apiObj) {
            if (apiObj.errors) {
                console.log("Error getObjByLink:", apiObj.title);
                reject(apiObj.errors);
            } else {
                //console.log("getObjByLink success:", apiObj);
                //store data received from search for link in global variable
                linkData[link] = apiObj;
                resolve(apiObj);
            }
        });
    });
}

//Array of links to fetch; the results of these are arrays of apiObjs
function getTargets(targetLinks, filter) {

    //helper function to filter out unwanted searches
    function filterLink(link, filter) {
        // console.log(filter);
        var matches = [
            ["organizations", /organizations$/],
            ["executives", /executives$/],
            ["portfolio_companies", /portfolio-companies$/],
            ["service_providers", /service-providers$/],
            ["investors", /investors$/],
            ["rounds", /rounds$/],
            ["limited_partners", /limited-partners$/],
            ["funds", /funds$/]
        ];
        for (var i = 0; i < matches.length; i++) {
            // console.log(matches[i]);
            // console.log(link, matches[i][1].test(link));
            if ( filter[matches[i][0]] && matches[i][1].test(link) ) {
                return true;
            }
        }
        return false;
    }

    console.log("getTargets targetLinks:", targetLinks);
    var targetPromises = [];
    targetLinks.forEach( (link) => {
        if (filterLink(link, filter)) {
            //look up if we already searched for this link
            if (linkData[link]) {
                targetPromises.push(linkData[link]);
            } else {
                targetPromises.push(getObjByLink(link));
            }
        }
    });
    return Promise.all(targetPromises)
        .then( (then) => {
            console.log("getTargets success:", then);
            var targets = [];
            then.forEach( (targetList) => {
                targetList.data.forEach( (apiObj) => {
                    targets.push(apiObj);
                });
            });
            // console.log("getTargets final targets:", targets);
            return targets;
        })
        .catch( (error) => {
            console.log("Error getTargets", error);
        });
}

//source: source node, targets: array of apiObjs
function addToGraph(source, targets, level) {
    var sourceId = source.id();
    console.log("sourceId:", sourceId);
    cy.batch(function() {
        targets.forEach( (target) => {
            console.log("target:", target);
            if (cy.$id(target.id).empty()) {
                // console.log("addToGraph target:", target);
                // console.log("addToGraph apiObjToCyEle:", apiObjToCyEle(target, level + 1) );
                cy.add(apiObjToCyEle(target, level + 1, sourceId));
            }
            if ( cy.$id(sourceId + "-" + target.id).empty() &&
                    cy.$id(target.id + "-" + sourceId).empty() ) {
                cy.add({
                     data: {
                         id: sourceId + "-" + target.id,
                         source: target.id,
                         target: sourceId
                     },
                     selectable: false
                 });
            }
        });
    });
}

function getTargetPromises(sources, options) {
    return sources.map( function(source) {
        return getTargets(source.data("relations"), options.filter);
    });
}

function addNodesByLevel(level, options) {
    // console.log("start addNodes");
    var quit = false;
    if (level < options.maxLevel && !quit) {
        var sources = cy.nodes().filter("[level = " + level + "]");
        var targetPromises = getTargetPromises(sources, options);
        Promise.all(targetPromises)
            .then( (targets) => {
                for (var i = 0; i < sources.length; i++) {
                    addToGraph(sources[i], targets[i], level);
                    // cy.layout(options.layout).run();
                }
                console.log("success adding level", level);
                addNodesByLevel(level + 1, options);
            })
            .catch( (error) => {
                console.log("Error addNodes getTargets", error);
                quit = true;
            });
    } else {
        console.log("addNodesByLevel complete");
        cy.resize();
        cy.layout(options.layout).run();
        $('#graphSpinner').hide();
        cy.nodes().forEach(function(ele) {
            ele.qtip({
                content: {
                    text: qtipText(ele),
                    title: ele.data('name')
                },
                style: {
                    classes: 'qtip-bootstrap'
                },
                position: {
                    my: 'bottom center',
                    at: 'top center',
                    target: ele
                }
            });
        });
    }
}

function addNodesBySource(source, options) {
    var targetPromises = getTargetPromises([source], options);
    var level = source.data("level");

    Promise.all(targetPromises)
        .then( (targets) => {
            addToGraph(source, targets[0], level);
            // console.log("source:", source);
            // console.log("targets:", targets);
            // cy.resize();
            var layout = cy.layout(options.layout);
            layout.one("layoutstop", function(evt) {
                cy.zoom({
                    level: 1.2,
                    position: source.position()
                });
            });
            layout.run();
            cy.nodes().forEach(function(ele) {
                ele.qtip({
                    content: {
                        text: qtipText(ele),
                        title: ele.data('name')
                    },
                    style: {
                        classes: 'qtip-bootstrap'
                    },
                    position: {
                        my: 'bottom center',
                        at: 'top center',
                        target: ele
                    }
                });
            });
            $('#graphSpinner').hide();
        })
        .catch( (error) => {
            console.log("Error addNodesBySource", error);
        });
}

function searchPeopleByName(formData, offset) {
    var search = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        offset: offset
    };

    return $.getJSON("/api/search/people", search)
        .then( (apiData) => {
            console.log("success search:", apiData);
            $("#resultsCount").text(apiData.meta.total_count + " result(s)");
            table.rows.add(apiData.data);
            apiData.data.forEach(function(person) {
                tableData[person.id] = person; //store in global variable for quick access later
                var entity = person.attributes.name.last_name +
                    ", " + person.attributes.name.first_name; //create unified entity name
                table.cell("#" + person.id, ".entity").data(entity);

                var linkSelf = person.links.self;
                table.cell("#" + person.id, ".self").data(linkSelf);

                getObjByLink(linkSelf)
                    .then( (apiData) => {
                        table.cell("#" + person.id, ".description").data(apiData.data.attributes.biography);
                    })
                    .catch( (error) => {
                        console.log("error:", error);
                    });

                // var company_names = "";
                // var linkRelations = person.relationships.organizations.links.related
                // getObjByLink(linkRelations)
                //     .then( (apiData) => {
                //         // console.log(apiData);
                //         apiData.data.forEach(function(relation) {
                //             company_names += relation.attributes.name.company_name + "; ";
                //         });
                //         table.cell("#" + person.id, ".relationships").data(company_names);
                //     })
                //     .catch( (error) => {
                //         console.log("error:", error);
                //     });

            });
            table.draw();
            console.log("meta:", apiData.meta.offset.next, apiData.meta.offset.last, offset);
            if (apiData.meta.offset.next > 0) {
                console.log("if apiData", apiData);
                searchPeopleByName(formData, apiData.meta.offset.next)
            } else {
                $('#tableSpinner').hide();
                table.draw();
            }
        })
        .catch( (error) => {
            table.draw();
            console.log("error:", error);
            return error;
        });
}

function getInfo(apiObj) {
    // console.log("org:", apiObj);
    switch (apiObj.type) {
        case "portfolio-companies":
            var entity = apiObj.attributes.name.company_name;
            if (apiObj.attributes.name.alternate_names) {
                entity += "(" + apiObj.attributes.name.alternate_names.familiar + ")";
            }
            return {
                entity: entity,
                description: apiObj.attributes.description
            };
            break;

        case "investors":
            var entity = apiObj.attributes.name.company_name;
            if (apiObj.attributes.name.alternate_names) {
                entity += " (" + apiObj.attributes.name.alternate_names.familiar + ")";
            }
            return {
                entity: entity,
                description: apiObj.attributes.description
            };
            break;

        case "service-providers":
            var entity = apiObj.attributes.name.company_name;
            if (apiObj.attributes.name.alternate_names) {
                entity += "(" + apiObj.attributes.name.alternate_names.familiar + ")";
            }
            return {
                entity: entity,
                description: ""
            };
            break;

        case "funds":
            var entity = apiObj.attributes.name.fund_name;
            return {
                entity: entity,
                description: apiObj.attributes.amount
            };
            break;

        case "limited-partners":
            var entity = apiObj.attributes.name.company_name;
            if (apiObj.attributes.name.alternate_names) {
                entity += "(" + apiObj.attributes.name.alternate_names.familiar + ")";
            }
            return {
                entity: entity,
                description: ""
            };
            break;
    }
}

function searchOrganizationByName(organization, type, offset) {
    console.log("searchOrgByName:", organization, type, offset);

    var search = {
        organization: organization,
        type: type,
        offset: offset
    };
    // console.log("search:", search);

    return $.getJSON("/api/search/organizations", search)
        .then( (apiData) => {
            console.log("success:", apiData);
            var resultsCount = parseInt( $("#resultsCount").text() );
            console.log(resultsCount);
            $("#resultsCount").text(apiData.meta.count + resultsCount + " result(s)");
            apiData.data.forEach( (org) => {
                if (table.rows("#" + org.id).any()) {
                    console.log("row exists");
                } else {
                    var addInfo = getInfo(org);
                    // console.log(org);
                    org.entity = addInfo.entity;
                    org.description = addInfo.description;
                    // console.log(org);
                    table.row.add(org);
                    tableData[org.id] = org;
                }
            });
            if (apiData.meta.offset.next > 0) {
                searchOrganizationByName(search.organization, search.type, apiData.meta.offset.next);
            } else {
                $('#tableSpinner').hide();
                table.draw();
            }
            table.draw();
        })
        .catch( (error) => {
            console.log("error:", error);
        });
}

$("#searchForm").on("submit", function() {
    var formData = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        organization: $("#organization").val(),
        portfolioCompanies: $("#chkSearchCompanies").is(':checked'),
        investors: $("#chkSearchInvestors").is(':checked'),
        serviceProviders: $("#chkSearchSP").is(':checked'),
        funds: $("#chkSearchFunds").is(':checked'),
        limitedPartners: $("#chkSearchLP").is(':checked')
    };
    console.log(formData);
    if ($("#radioPeople").hasClass("active")) {
        if (formData.firstName.length == 0 || formData.lastName.length == 0) {
            $("#firstName").addClass("warning");
            $("#lastName").addClass("warning");
            return false;
        }
    } else {
        if (formData.organization.length == 0) {
            $("#organization").addClass("warning");
            return false;
        }
    }
    $("#firstName, #lastName, #organization").removeClass("warning");
    $("#tablePanel").collapse("show");
    $('#tableSpinner').show();

    if ( $("#radioPeople").hasClass("active") ) {
        searchPeopleByName(formData, 0);
        table.draw();
    } else {
        var organizationTypes = ["portfolioCompanies", "investors", "serviceProviders",
            "funds", "limitedPartners"];
        $("#resultsCount").text("0");
        organizationTypes.forEach( (type) => {
            if (formData[type]) {
                console.log("type:", type);
                searchOrganizationByName(formData.organization, type, 0);
            }
        });
        // table.draw();
    }
});

$("#graphBtn, #reGraphBtn").on("click", function() {
    var targets = [];
    console.log($(".selectedRow"));
    $(".selectedRow").each( function(row) {
        try {
            var id = table.row(this).data().id
            targets.push( tableData[id] );
        } catch(error) {
            console.log("error:", error);
        }
    });
    if (targets.length == 0) {
        return false;
    }
    $("#searchPanel").collapse("hide");
    $("#tablePanel").collapse("hide");
    $('html, body').animate({
        scrollTop: $("#graphPanel").offset().top
    }, 2000);
    console.log(targets);
    var options = {
        maxLevel: $("#maxLevel").val(),
        layout: coseLayout,
        filter: {
            organizations: true,
            portfolio_companies: $("#chkGraphCompanies").is(':checked'),
            investors: $("#chkGraphInvestors").is(':checked'),
            executives: $("#chkGraphExecutives").is(':checked'),
            service_providers: $("#chkGraphSP").is(':checked'),
            limited_partners: $("#chkGraphLP").is(':checked'),
            funds: $("#chkGraphFunds").is(':checked'),
            rounds: $("#chkGraphRounds").is(':checked')
        }
    };
    console.log("options:", options);
    cy.elements().remove();
    $('#graphSpinner').show();
    for (var i = 0; i < targets.length; i++) {
        if (cy.$id(targets[i].id).empty()) {
            cy.add( apiObjToCyEle(targets[i], 0) );
        }
        // cy.layout(options.layout);
        try {
            addNodesByLevel(0, options);
        } catch(error) {
            console.log(error);
        }
    }
});

cy.on('click', "node", function(evt){
    if ( !$("#chkOnTheGo").is(":checked") ) {
        return false;
    }
    console.log(evt.target);
    if (evt.target.data("type") == "intro") {
        return false;
    }
    // console.log( 'tap ' + evt.target.id() );
    var source = evt.target;
    // console.log(source);
    var options = {
        maxLevel: 1,
        layout: coseLayout,
        filter: {
            organizations: true,
            portfolio_companies: $("#chkGraphCompanies").is(':checked'),
            investors: $("#chkGraphInvestors").is(':checked'),
            executives: $("#chkGraphExecutives").is(':checked'),
            service_providers: $("#chkGraphSP").is(':checked'),
            limited_partners: $("#chkGraphLP").is(':checked'),
            funds: $("#chkGraphFunds").is(':checked'),
            rounds: $("#chkGraphRounds").is(':checked')
        }
    };
    $('#graphSpinner').show();
    addNodesBySource(source, options);
});


//events
$("#radioPeople").on("click", function() {
    if ( $(this).hasClass("active") ){
        return false;
    } else {
        $(this).addClass("active");
        $("#radioOrganization").removeClass("active");
        $("#firstName, #lastName, #organization").val("");
        $("#firstName, #lastName, #organization").removeClass("warning");
        $("#chkSearch").toggle();
        $("#firstName").toggle();
        $("#lastName").toggle();
        $("#organization").toggle();
    }
});

$("#radioOrganization").on("click", function() {
    if ( $(this).hasClass("active") ){
        return false;
    } else {
        $(this).addClass("active");
        $("#radioPeople").removeClass("active");
        $("#firstName, #lastName, #organization").val("");
        $("#firstName, #lastName, #organization").removeClass("warning");
        $("#chkSearch").toggle();
        $("#firstName").toggle();
        $("#lastName").toggle();
        $("#organization").toggle();
    }
});

$("#resetTableBtn").on("click", function() {
    table.clear().draw();
});

$("#clearTableBtn").on("click", function() {
    table.rows(":not(.selectedRow)").remove().draw();
});


$("#centerBtn").on("click", function() {
    cy.center();
});

$("#fitBtn").on("click", function() {
    cy.fit();
});

$("#layoutCoseBtn").on("click", function() {
    cy.layout(coseLayout).run();
    cy.center();
});

$("#layoutGridBtn").on("click", function() {
    cy.layout(gridLayout).run();
    cy.center();
});

$("#layoutConcentricBtn").on("click", function() {
    cy.layout(concentricLayout).run();
    cy.center();
});

$("#layoutCoseBilkentBtn").on("click", function() {
    cy.layout(coseBilkentLayout).run();
    cy.center();
});

$("#results tbody").on("click", "tr", function() {
    if ($(this).hasClass('selectedRow')) {
        $(this).removeClass('selectedRow');
    } else {
        $(this).addClass('selectedRow');
    }
});

$(".btn-control").on("click", function() {
    var action = $(this).attr('data-action');
    var value  = parseInt( $("#maxLevel").val() );
    var min = parseInt( $("#maxLevel").attr("min") );
    var max = parseInt ( $("#maxLevel").attr("max") );
    if ( action == "plus" && value < max ) {
        value++;
    }
    if ( action == "minus"  && value > min ) {
        value--;
    }
    $("#maxLevel").val(value);
});


});
