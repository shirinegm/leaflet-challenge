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
    center: [38.40, -108.30],
    zoom: 4.4,
    layers: [lightmap, earthquakes]
  });

  // Layer Control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
};

function createMarkers(response) {
    
    // Get earthquakes from json
    let features = response.features;

    //console.log(features);

    let epicenterMarkers = [];

    for (let index = 0; index < features.length; index++) {

        let epicenter = features[index].geometry.coordinates;
        let epicenterInfo = features[index].properties;
        // console.log(epicenter);

        let epicenterMarker = L.marker([epicenter[1], epicenter[0]])
            .bindPopup("<h6>Magnitude: " + epicenterInfo.mag + "</h6><h6>Place: " + epicenterInfo.place + "</h6>");
        epicenterMarkers.push(epicenterMarker);
    }
    
    createMap(L.layerGroup(epicenterMarkers));

};

// Get Earthquake information from usgs then pass it on to create Markers
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);