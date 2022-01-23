console.log("logic.js loaded");

function createMap(earthquakes) {
    // Tile Layer Background
    let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  let baseMaps = {
    "Light Map": lightmap
  };

  // Overlay
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Map Object
  let map = L.map("map", {
    center: [40.169692, -121.228002],
    zoom: 4,
    layers: [lightmap, earthquakes]
  });

  // Layer Control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // Add a legend
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [10, 30, 50, 70, 90, 100],
    labels = ["-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    let legendRows = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        legendRows.push("<i style=\"background-color: " + colorByDepth(grades[i]) + "\">" + labels[i] + "</i>");
    };

    div.innerHTML += legendRows.join("<br>");

    return div;
  };
  legend.addTo(map);

};

// Function to set the color depending on the depth of the earthquake
function colorByDepth(depth) {
    let color = "";
    
    if (depth <= 10) { color = "darkseagreen";}
    else if ((depth > 10) && (depth <= 30)) { color = "gold";}
    else if ((depth > 30) && (depth <= 50)) { color = "darkorange";}
    else if ((depth > 50) && (depth <= 70)) { color = "red";}
    else if ((depth > 70) && (depth <= 90)) { color = "indianred";}
    else { color = "darkred";}

    // console.log(color);
    return color;

};

function createMarkers(response) {
    
    // Get earthquakes from json
    let features = response.features;

    //console.log(features);

    let epicenterMarkers = [];

    for (let index = 0; index < features.length; index++) {

        let epicenter = features[index].geometry.coordinates;
        let epicenterInfo = features[index].properties;
        // console.log(epicenter[2]);

        let epicenterMarker = L.circle([epicenter[1], epicenter[0]], {
            color: colorByDepth(epicenter[2]),
            fillcolor: colorByDepth(epicenter[2]),
            fillOpacity: 0.6,
            radius: epicenterInfo.mag * 20000,
            weight: 1
        }).bindPopup("<h6>Magnitude: " + epicenterInfo.mag + "</h6><h6>Place: " + epicenterInfo.place + "</h6><h6>Depth: " + epicenter[2] + "</h6>");
        epicenterMarkers.push(epicenterMarker);
    }
    
    createMap(L.layerGroup(epicenterMarkers));

};

// Get Earthquake information from usgs then pass it on to create Markers
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);