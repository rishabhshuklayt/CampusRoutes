// socket connection established
const socket = io();

// checking if geolocation is available or not
if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
} else {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

// Initialize the map and set its view to a chosen geographical coordinates and zoom level
var map = L.map('map').setView([26.553985118707853, 81.04663578178864], 16);

// Load and display a tile layer on the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '<img width="14" height="14" src="https://img.icons8.com/cute-clipart/64/instagram-new.png" alt="instagram-new"/> <a href="https://www.instagram.com/rishabh_y.t/">Follow me</a>'
}).addTo(map);

// Object to store markers
const markers = {};

// Socket event listener for 'receive-location'
socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;
    console.log(data);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude], { draggable: false })
            .addTo(map)
            .bindPopup(`User ${id}`)
            .openPopup();
    }
});

// Socket event listener for 'user-disconnected'
socket.on('user-disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

// Function to handle location found event
function onLocationFound(e) {
    var radius = e.accuracy;
    L.marker(e.latlng, { draggable: false }).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);
}

// Function to handle location error event
function onLocationError(e) {
    alert(e.message);
}

// Event listeners for location found and location error
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

var myIcon = L.icon({
    iconUrl: 'https://png.pngtree.com/png-clipart/20220824/ourmid/pngtree-school-bus-top-view-transparent-png-image_6121877.png',
    iconSize: [50, 70],
    iconAnchor: [25, 25]
});

// Add a marker at a specific location
var marker = L.marker([26.767989709635387, 80.94553389788534], { icon: myIcon }).addTo(map);

// Add routing control
var routingControl = L.Routing.control({
    waypoints: [
        L.latLng(26.774970628900512, 80.8863775018469),
        L.latLng(26.553985118707853, 81.04663578178864)
    ],
    routeWhileDragging: true,
    lineOptions: {
        styles: [{ color: 'Red', opacity: 1, weight: 7 }]
    },
    createMarker: function (i, waypoint, n) {
        // Create non-draggable markers
        return L.marker(waypoint.latLng, {
            draggable: false // Set draggable to false to prevent dragging
        }).bindPopup("Waypoint " + (i + 1));
    }
}).addTo(map);

// Add a custom button to recenter the map
L.Control.MyLocation = L.Control.extend({
    onAdd: function (map) {
        var button = L.DomUtil.create('button', 'my-custom-button');
        button.innerHTML = '📍'; // You can use an icon here
        button.title = 'Go to my location';
        L.DomEvent.on(button, 'click', function () {
            map.locate({ setView: true, maxZoom: 16 });
        });
        return button;
    }
});

L.control.myLocation = function (opts) {
    return new L.Control.MyLocation(opts);
}

L.control.myLocation({ position: 'topleft' }).addTo(map);

// Adding time and distance calculator
routingControl.on('routesfound', function (e) {
    var routes = e.routes;
    var summary = routes[0].summary;
    var distance = summary.totalDistance / 1000; // distance in km
    var time = summary.totalTime / 3600; // time in hours

    console.log('Distance: ' + distance.toFixed(2) + ' km\nTime: ' + time.toFixed(2) + ' hours');
    alert('Distance: ' + distance.toFixed(2) + ' km\nTime: ' + time.toFixed(2) + ' hours');
});
