 var map = L.map('meteoritemap', {
	zoomControl: false,
	minZoom: 7,
    maxZoom: 9,
	doubleClickZoom:'center',
	wheelPxPerZoomLevel:100,
 }).setView([33.65, -81.12], 7);

var DarkGrayMap = L.esri.basemapLayer('DarkGray').addTo(map);

var marker1 = L.marker([34.2182, -80.2484],).addTo(map)
	.bindPopup('<h6>Bishopville, SC</h6><p><strong>Type: </strong>Achondrite<br><strong>Year: </strong>1843</p>');
;

var marker2 = L.marker([34.1963, -81.4123],).addTo(map)
	.bindPopup('<h6>Ruff&#39;s Mountain, Newberry County</h6><p><strong>Type: </strong>Octahedrite<br><strong>Year: </strong>1844</p>');

var marker3 = L.marker([34.7360, -80.0881],).addTo(map)
	.bindPopup('<h6>Chesterville, SC</h6><p><strong>Type: </strong>Ataxite<br><strong>Year: </strong>1849</p>');
;

var marker4 = L.marker([34.5203, -82.1278],).addTo(map)
	.bindPopup('<h6>Laurens County</h6><p><strong>Type: </strong>Octahedrite<br><strong>Year: </strong>1857</p>');
;

var marker5 = L.marker([33.9310, -81.2519],).addTo(map)
	.bindPopup('<h6>Lexington County</h6><p><strong>Type: </strong>Octahedrite<br><strong>Year: </strong>1880</p>');
;

var marker6 = L.marker([35.0497, -81.8911],).addTo(map)
	.bindPopup('<h6>Cherokee Springs, SC</h6><p><strong>Type: </strong>Chondrite<br><strong>Year: </strong>1933</p>');
;