var basemapUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
var attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
var geojson;

//initial content in information window
$('#infoWindow').html('Information Window<br />Updates as you hover over a tract');

//initialize map1
var map1 = L.map('map1', {
scrollWheelZoom: true
}).setView([40.739061, -73.952654], 11);

//CartoDB Basemap
L.tileLayer(basemapUrl,{
	attribution: attribution
}).addTo(map1);

//this function takes a value and returns a color based on which bucket the value falls between
function getColor(d) {
  return d > 90 ? '#542788' :
         d > 70 ? '#2166ac' :
         d > 50 ? '#92c5de' :
         d > 30 ? '#f4a582' :
         d > 10 ? '#d7191c' :
                  '#a50f15';
}

//select desired column from dataset when appropriate button is clicked
var redi_column = 'redi_nor_1'; // initially shows equal weigths REDI score

$("#eqWeight").click(function(){
  redi_column = 'redi_nor_1';
  geojson.setStyle(style);
});

$("#catSum").click(function(){
  redi_column = 'redi_pct_1';
  geojson.setStyle(style);
});

$("#socInf").click(function(){
  redi_column = 'socredno_1';
  geojson.setStyle(style);
});

$("#phyInf").click(function(){
  redi_column = 'infredno_1';
  geojson.setStyle(style);
});

$("#envCon").click(function(){
  redi_column = 'envredno_1';
  geojson.setStyle(style);
});

$("#econStr").click(function(){
  redi_column = 'ecoredno_1';
  geojson.setStyle(style);
});

//this function returns a style object, but dynamically sets fillColor based on the data
function style(feature) {
return {
    fillColor: getColor(feature.properties[redi_column]),
    weight: 1,
    opacity: 0.5,
    color: '',
    dashArray: '',
    fillOpacity: 1
  };
}

//this function is set to run when a user mouses over any polygon
function mouseoverFunction(e) {
var layer = e.target;

layer.setStyle({
    weight: 3,
    color: 'blue',
    dashArray: '',
    fillOpacity: 1
});

if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
}

//update the text in the infowindow with whatever was in the data
//console.log(layer.feature.properties.NTAName);
$('#infoWindow').html(layer.feature.properties.NTAName+'<br />REDI Score: '+Math.round(layer.feature.properties[redi_column]));
}

//this runs on mouseout
function resetHighlight(e) {
	geojson.resetStyle(e.target);
}

//this is executed once for each feature in the data, and adds listeners
function onEachFeature(feature, layer) {
	layer.on({
	    mouseover: mouseoverFunction,
	    mouseout: resetHighlight
	    //click: zoomToFeature
	});
}

//be sure to specify style and onEachFeature options when calling L.geoJson().
$.getJSON('data/redi.geojson', function(redi_data) {
	geojson = L.geoJson(redi_data,{
	  style: style,
	  onEachFeature: onEachFeature
	}).addTo(map1);
});

// map1.setZoom(9);

// adding a legend to the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 30, 50, 70, 90],
        labels = [];

    // loop through redi score intervals and generate a label and colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : ' &ndash; 100');
    }

    return div;
};

legend.addTo(map1);