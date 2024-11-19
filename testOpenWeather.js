let map;  // Variable pour stocker la carte Leaflet afin de la réinitialiser à chaque recherche

// Fonction pour obtenir la météo et afficher la carte
function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a950f5d15e54b182c392c864357ceae9&lang=fr&units=metric`)
        .then(function(response) {
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: Ville incorrecte`);
            }
            return response.json();
        })
        .then(function(data_weather) {
            console.log('Données reçues de l\'API:', data_weather);
            
            if (data_weather.cod !== 200) {
                alert('Erreur dans la récupération des données météo.');
                return;
            }

            var weather = data_weather.weather[0];
            var main = data_weather.main;
            var wind = data_weather.wind;
            var lat = data_weather.coord.lat;
            var lon = data_weather.coord.lon;

            printMessage(city, main.temp, weather.description, weather.icon, main.humidity, wind.speed);

            // Mise à jour des coordonnées GPS
            document.getElementById('coordinates').textContent = `Coordonnées GPS: Latitude ${lat.toFixed(2)}, Longitude ${lon.toFixed(2)}`;

            if (map) {
                map.remove();  // Supprime l'ancienne carte
            }

            displayMap(lat, lon);  // Affiche une nouvelle carte avec les coordonnées
        })
        .catch(function(error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la récupération des données météo.');
        });
}

// Fonction pour afficher les informations météo sur la page
function printMessage(city, temperature, description, icon, humidity, wind) {
    document.getElementById('city-name').textContent = city;
    document.getElementById('temperature').textContent = `${temperature}°C`;
    document.getElementById('description').textContent = description;
    document.getElementById('humidity').textContent = `Humidité: ${humidity}%`;
    document.getElementById('wind').textContent = `Vent: ${wind} m/s`;

    // Construction correcte de l'URL pour l'icône météo
    var iconUrl = `https://openweathermap.org/img/wn/10d@2x.png`;
    document.getElementById('weather-icon').src = iconUrl;
}


function displayMap(latitude, longitude) {
    map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`<b>Coordonnées GPS</b><br>Latitude: ${latitude.toFixed(2)}<br>Longitude: ${longitude.toFixed(2)}`)
        .openPopup();
}

document.getElementById('search-button').addEventListener('click', function() {
    var city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
    } else {
        alert('Veuillez entrer une ville.');
    }
});
