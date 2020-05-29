type: 'GET';
dataType: "jsonp";
var map = L.map('map', {
    center: [33.8, -81.1],
    zoom: 7,
    minZoom: 7,
    maxZoom: 16,
	zoomControl: false,
    fullscreenControl: true
});
L.Control.Fullscreen;

var bm = L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    id: 'scearthsci.mm82lp7o',
    accessToken: 'pk.eyJ1Ijoic2NlYXJ0aHNjaSIsImEiOiI3NTg0NGM0ZTMzNjI5N2Q5ZDRmMWQ0YjI5MjczNTlhYSJ9.36fX8a8aHxH7ZouF3KqMqQ',
    maxZoom: 16
}).addTo(map);
//ADD EXTRA CONTROLS, LEGEND AND INFO -> LAYER CONTROL ADDED LATER
var legend = L.control({
    position: 'bottomleft'
});
var info = L.control({
    position: 'bottomright'
});
var zoomHome = L.Control.zoomHome({position: 'topleft'});
zoomHome.addTo(map);

//FUNCTION THAT ADDS DATA AND BINDS EVERYTHING TO IT AFTER IT GETS DATA FROM USGS FEED
function addDataToMap(data, map) {

    function rad(m) {
        //makes area proportional, log scale
        var scaleFactor = 4,
            area = Math.exp(m) * scaleFactor;
        //converts proportional areas to radius
        return Math.sqrt(area/Math.PI)*2;
    };


    var days = 86400000;
    var week = days * 7;
    var month = days * 30;
    var year = days * 365;

    function col(c) {
        return timeNow - c < week ? '#bd0026' :
            timeNow - c < month ? '#f03b20' :
            timeNow - c < year ? '#fd8d3c' :
            '#fecc5c';
    }

    function eqStyle(feature) {
        return {
            radius: rad(feature.properties.mag),
            fillColor: col(feature.properties.time),
            color: '#000',
            weight: 1,
            opacity: 0.9,
            fillOpacity: 0.7
        };
    }
    //COUPLE OF DATE VARIABLES
    var timeNow = Date.now();
    dateCurrent = new Date(timeNow)

    //TOOLTIP CONTROL ON HOVER ~~~~TESTING~~~~~
    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function(props) {
        this._div.innerHTML = (props ?
            '<span>Magnitude: <b>' + props.mag + '</b></span><br/><span>Date: <b>' + new Date(props.time).toLocaleDateString() + '</b></span>' : 'Recent EQs');
    };

    info.addTo(map);

    //DEFINES WHAT TO DO WHEN EQ POINT IS HOVERED/non hovered FOR TOOLTIP
    function tooltip(e) {
        var layer = e.target;
        info.update(layer.feature.properties);
    }

    function toolout(e) {
        info.update();
    }

    function popUp(feature, layer) {
        eqDate = new Date(feature.properties.time)
        layer.bindPopup("<table>"+
            "<tr><td><b>Event ID: </b></td><td>" + feature.id + "</td></tr>" +
            "<tr><td><b>Magnitude: </b></td><td>" + feature.properties.mag + "</td></tr>" +
            "<tr><td><b>Date: </b></td><td>" +  eqDate.toLocaleDateString() + "</td></tr>" +
            "<tr><td><b>Depth: </b></td><td>" + String(feature.geometry.coordinates[2]) + " km</td></tr>" +
            "<tr><td><b>Type: </b></td><td>" + feature.properties.type + "</td></tr>" +
            "<tr><td><b>URL: </b></td><td><a href='" + feature.properties.url + "' target='_blank'>USGS Web Page</a></td></tr></table>"
        );
        //INSIDE SAME POPUP FUNCTION TO RUN WITH ONEACHFEATURE, POPULATE TOOLTIP
        layer.on({
            mouseover: tooltip,
            mouseout: toolout
        });
    };

    //INTERACTION WITH SIDE BAR
    //MAKE A NEW FEATURE GROUP THAT WILL STORE AND ZOOM WHEN AN EQ IN TABLE IS CLICKED, ADD TO MAP
    var zoomGroup = new L.featureGroup().addTo(map)

    //GET TOP TEN DATA POINTS FROM THE FEED, FORMAT TO HTML
    $.each(data.features.slice(-10), function(i, d) {
        eqDate = new Date(d.properties.time)
        var topten = "<div class='topteneq'>" +
            "<div class='zoomPoint'>" +
            "<table><tr><td><b>Date:<b> </td><td>" + eqDate.toLocaleDateString() + "</td></tr>" +
            "<tr><td><b>Magnitude:<b> </td><td>" + d.properties.mag + "</td></tr>" +
            "<tr><td><b>Depth (km): <b></td><td>" + d.geometry.coordinates[2] + "</td></tr></table>"+
            "<span class='novis'>" + d.id + "</span></div>"+
            "</div>"
        $("#eqlist").prepend(topten);
    });

    //CREATES ACTION FOR ZOOM TO EQ THAT IS CLICKED IN THE TABLE
    $('.topteneq').on('click', 'div.zoomPoint', function() {
        zoomGroup.clearLayers();
        var eventID = $(this).find("span.novis").text()
        var topTenPoint = L.geoJson(data, {
            filter: function(feature, layer) {
                return feature.id == eventID;
            },
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    color: '#ff0000',
                    fillColor: '#cc3300',
                    weight: 4,
                    opacity: 0.9,
                    fillOpacity: 0.4,
                    radius: rad(feature.properties.mag) + 1.5
                });
            },
            onEachFeature: popUp

        });

        zoomGroup.addLayer(topTenPoint);
        map.fitBounds(zoomGroup.getBounds(), {
            maxZoom: 11
        });
        zoomGroup.bringToFront().openPopup();
    });

    //CREATE GEOJSON FROM DATASETS
    var dataLayer = new L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, eqStyle(feature))
        },
        onEachFeature: popUp
    }).addTo(map);
    //FILTERED DATASETS
    var year = new L.geoJson(data, {
        filter: function(feature, layer) {
            return timeNow - feature.properties.time <= year;
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, eqStyle(feature))
        },
        onEachFeature: popUp
    });
    var month = new L.geoJson(data, {
        filter: function(feature, layer) {
            return timeNow - feature.properties.time <= month;
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, eqStyle(feature))
        },
        onEachFeature: popUp
    });
    var week = new L.geoJson(data, {
        filter: function(feature, layer) {
            return timeNow - feature.properties.time <= week;
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, eqStyle(feature))
        },
        onEachFeature: popUp
    });

    //CREATE OBJECT FOR LAYER CONTROLS
    var filterEQs = {
            "Since 2006": dataLayer,
            "Within the year": year,
            "Within the month": month,
            "Within the week": week
        }
        //CREATE LAYER CONTROL, ADD TO MAP
    var layerControl = L.control.layers(filterEQs).addTo(map);

    //LEGEND
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = ['#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
            labels = ['Since 2006', 'Within the year', 'Within the month', 'Within the week'];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var z = 0; z < grades.length; z++) {
            div.innerHTML +=
                '<i style="background:' + grades[z] + '"></i> ' +
                labels[z] + '<br>';
        }
        return div;
    };

    legend.addTo(map);

    $( ".leaflet-control-zoomhome-home").click(function() {
        zoomGroup.clearLayers();
    });
    //ADDED TO BOTTOM OF LEGEND TO SUGGEST SIZE OF CIRCLE INCREASES BASED ON MAGNITUDE
    $('div.info.legend.leaflet-control').append('<div id="lowerlegend"><i id="large"><i id="medium"><i id="small"></i></i></i><span style="font-style:italic;">Size increases w/ mag</span><div>');

}

$(document).ready(function(){
	//WHEN DOC IS LOADED, SENDS REQUEST, GETS DATA, RUNS addDataToMap FUNCTION ABOVE.
    $.getJSON("http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=34&longitude=-81&maxradiuskm=300&starttime=2006-01-01&orderby=time-asc",
        function(data) {
            addDataToMap(data, map);
        })
        .always(function() {
            $('#loading').hide();
    });
});
