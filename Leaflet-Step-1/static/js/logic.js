// Creating a map object
let myMap = L.map("map", {
    center: [33.2115,-115.5961667],
    zoom: 4
});

//Adding the layer
let maplayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoiaHByZWV0MTQxNCIsImEiOiJja2xsMnIxeDIyeHg0MndtbDhxeXNydHg4In0.XjdmQx8vgqs0M8TUKo1aFw"
}).addTo(myMap);

// Setting the GeoJSON URL
let URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Getting the GeoJSON Data
d3.json(URL, function (Data)  {
// Setting layergroups
let earthquakes = Data.features;

// Setting the color range for each set of magnitude
let color = {

    level1: "#00FF80",
    level2: "#80FF00",
    level3: "#FFFF00",
    level4: "#FF0080", 
    level5: "#FF8000",
    level6: "#FF0000"

}

// Determing variables to D3
for (let i = 0; i < earthquakes.length; i++) {
    let latitude = earthquakes [i].geometry.coordinates[1];
    let longitude = earthquakes [i].geometry.coordinates[0];
    let magnitude = earthquakes [i].properties.mag;
    let fillColor;
    if (magnitude > 5) {
        fillColor = color.level6;
    }
    else if (magnitude > 4) {
        fillColor = color.level5;
    }
    else if (magnitude > 3) {
        fillColor = color.level4;
    }
    else if (magnitude > 2) {
        fillColor = color.level3;
    }
    else if (magnitude > 1) {
        fillColor = color.level2;
    } 
    else {
        fillColor = color.level1;
    }

    let epicenter = L.circleMarker([latitude, longitude], {
        weight: 1,
        color: 'white',
        fillColor: fillColor,
        fillOpacity: 1,
        radius: magnitude ** 2
    });
    epicenter.addTo(myMap);

    epicenter.bindPopup("<h3>" + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude +
    "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");
}

// Legend to appear bottom right of the chart
var legend = L.control({position: 'bottomright'});

// Adding color schee to legends
legend.onAdd = function (color) {

var div = L.DomUtil.create("div", "info legend");
var levels = ['>1', '1-2', '2-3', '3-4', '4-5', '5+'];
var colors = ["#00FF80", "#80FF00", "#FFFF00", "#FF0080", "#FF8000","#FF0000"]   

for (var i = 0; i < levels.length; i++) {

        div.innerHTML +=
        '<i style ="background:' +  colors[i] + '"></i>' + levels[i] + '<br>';

    }
     return div;
     }

     legend.addTo(myMap);
    })