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

function fetchByCityName(cityName) {
    const parameterName = cityName
        .replaceAll("-", " ")
        .replaceAll(" ", "%20");
    return fetch("https://community-open-weather-map.p.rapidapi.com/weather?units=%2522metric%2522&q=" +
        parameterName, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "92a10174c9msh3a9e3dd3af401a3p189382jsnb06cb9b21739"
        }
    })
        .then(response => response.json())
        .catch(err => {
            console.log(err);
        });
}

function getTemplate(json, prefix) {

    console.log(json);

    const temp = document.getElementById(prefix + "city").content;
    const copytemp = document.importNode(temp, true);

    copytemp.getElementById(prefix + "location").innerText = json.name;
    copytemp.getElementById(prefix + "img").src =
        "img/" + json.weather[0].icon + ".png";
    copytemp.getElementById(prefix + "temperature").innerText =
        parseFloat(json.main.temp - 273.15).toFixed(0) + "°С";
    copytemp.getElementById(prefix + "wind").innerText =
        "Degree: " + json.wind.deg + "°, " + json.wind.speed + " m/s";
    copytemp.getElementById(prefix + "clouds").innerText =
        json.clouds.all + " %";
    copytemp.getElementById(prefix + "pressure").innerText =
        json.main.pressure + " hpa";
    copytemp.getElementById(prefix + "humidity").innerText =
        json.main.humidity + " %";
    copytemp.getElementById(prefix + "coords").innerText =
        "[" + json.coord.lat + ", " + json.coord.lon + "]";

    if (prefix === "fav-") {
        copytemp.getElementById("close-btn").value = json.id;
        copytemp.getElementById("start").id = json.id;
    }

    return copytemp;
}

function addCity() {
    let flag = 1;
    const form = document.getElementById("add-city-form");
    const cityName = document.getElementById("form-city-name").value;
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (localStorage.getItem(key) === cityName) {
            alert("This city is already in favourites");
            flag = 0;
            break;
        }
    }
    form.reset();
    if(flag)
        PostCityWeather(cityName);
}

function loadCitiesFromStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        PostCityWeather(localStorage.getItem(key));
    }
}
