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
    center: [40.73, -74.0059],
    zoom: 12,
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
        // console.log(epicenter);

        let epicenterMarker = L.marker([epicenter[0], epicenter[1]]);
        epicenterMarkers.push(epicenterMarker);
        //console.log(epicenterMarkers);
    }
    
    createMap(L.layerGroup(epicenterMarkers));

};

// Get Earthquake information from usgs then pass it on to create Markers
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);