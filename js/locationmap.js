 var map = L.map('locationmap', {
 }).setView([34.08, -81.12], 10);

var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
}).addTo(map);

var marker = L.marker([34.08062877, -81.12123907],).addTo(map)
	.bindPopup('<a href="https://www.google.com/maps/dir//5+Geology+Rd,+Columbia,+SC+29212/@34.0785136,-81.1240748,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x88f8a23494d989bf:0xf7a05fa72a2bac4f!2m2!1d-81.1211801!2d34.0805577">South Carolina Geological Survey</a>')
    .openPopup();
;