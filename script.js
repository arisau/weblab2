function updateWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function success(position) {
    PostMainCityWeather(position.coords.latitude, position.coords.longitude);
}

function PostMainCityWeather( latitude, longitude,) {
    const loader = getLoader();
    const mainCitySection = document.getElementById("main-city-section")
    if (mainCitySection.firstElementChild) {
        mainCitySection.removeChild(mainCitySection.firstElementChild);
        mainCitySection.removeChild(mainCitySection.firstElementChild);
    }
    mainCitySection.appendChild(loader);

    const weatherData = fetchByCoords(latitude, longitude);
    weatherData.then((result) => {
        const template = getTemplate(result, "main-");
        mainCitySection.getElementsByClassName("loader")[0].remove();
        mainCitySection.appendChild(template)
    })
}

function error() {
    alert("Unable to retrieve your location; Loading default...");
    PostMainCityWeather(59.89, 30.26);
}

function fetchByCoords(latitude, longitude) {
    return fetch("https://community-open-weather-map.p.rapidapi.com/weather?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&units=%22metric%22", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "92a10174c9msh3a9e3dd3af401a3p189382jsnb06cb9b21739"
        }
    })
        .then(response => response.json())
        .catch(err => {
            const mainCitySection = document.getElementById("main-city-section");
            mainCitySection.getElementsByClassName("loader")[0].remove();
            alert("Unable to load weather");
            console.log(err)
        });
}
