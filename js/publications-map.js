 var map = L.map('pub-map', {
 zoomControl: true,
 dragging: true,
 doubleClickZoom: true,
 }).setView([33.6, -81], 7);

var topoMap = L.esri.basemapLayer("Topographic").addTo(map);

var quadsShown = L.esri.featureLayer({
    url: "https://services.arcgis.com/acgZYxoN5Oj8pDLa/arcgis/rest/services/24K_Quads/FeatureServer/0",
	fillOpacity: 0,
	opacity: 0,
	color: 'black',
	weight: 0
}).addTo(map);
	
quadsShown.bindPopup(function (layer) {
	return L.Util.template('<h6>{QUADNAME}</h6><p>{Pub_1}<br>{Pub_2}<br></p>', layer.feature.properties )
	return L.Util.template('<h6>{QUADNAME}</h6>', layer.feature.properties )
});

/*	
var quads = L.esri.featureLayer({
    url: "https://services.arcgis.com/acgZYxoN5Oj8pDLa/arcgis/rest/services/24K_Quads/FeatureServer/0",
	fillOpacity: 0,
	opacity: 1,
	color: '#97C1AD',
	weight: 1
});

var layerControlQuads = {
    "Quadrangle Boundaries": quads,
}

var layerControl = L.control.layers(layerControlQuads).addTo(map);
*/