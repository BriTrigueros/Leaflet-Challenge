// Initialize the map
var map = L.map('map').setView([37.7749, -122.4194], 5); // Centered on the USA

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        // Function to determine marker color based on depth
        function getColor(depth) {
            return depth > 90 ? '#800026' :
                   depth > 70 ? '#BD0026' :
                   depth > 50 ? '#E31A1C' :
                   depth > 30 ? '#FC4E2A' :
                   depth > 10 ? '#FD8D3C' :
                                '#FEB24C';
        }

        // Function to determine marker size based on magnitude
        function getRadius(magnitude) {
            return magnitude * 4;
        }

        // Create a GeoJSON layer
        L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: '#000',
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindPopup(`<h3>${feature.properties.place}</h3><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
            }
        }).addTo(map);

        // Add a legend
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'legend');
            var grades = [0, 10, 30, 50, 70, 90];
            var labels = [];

            div.innerHTML += '<b>Depth (km)</b><br>';
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };
        legend.addTo(map);
    })
    .catch(error => console.error('Error fetching data:', error));
