const consoleBox = document.getElementById("consoleBox");
const errorMsg = document.getElementById("errorMsg");

function log(message) {
    console.log(message);
    consoleBox.innerHTML += message + "<br>";
}

function runEventLoopDemo() {

    log("1️⃣ Sync Start");

    setTimeout(() => {
        log("5️⃣ setTimeout (Macrotask)");
    }, 0);

    Promise.resolve().then(() => {
        log("4️⃣ Promise.then (Microtask)");
    });

    log("2️⃣ Sync End");
}

runEventLoopDemo();

async function fetchWeather() {

    errorMsg.innerText = "";
    consoleBox.innerHTML = "";

    log("1️⃣ Sync Start");
    log("3️⃣ [ASYNC] Start fetching");

    const cityInput = document.getElementById("cityInput").value.trim();

    try {

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        const weatherData = await weatherResponse.json();
        const weather = weatherData.current_weather;

        document.getElementById("city").innerText = name + ", " + country;
        document.getElementById("temp").innerText = weather.temperature + " °C";
        document.getElementById("weather").innerText = weather.weathercode;
        document.getElementById("humidity").innerText = "-";
        document.getElementById("wind").innerText = weather.windspeed + " m/s";

        saveHistory(name);

        log("6️⃣ [ASYNC] Data received");

    } catch (error) {
        errorMsg.innerText = "City not found";
    }

    Promise.resolve().then(() => {
        log("4️⃣ Promise.then (Microtask)");
    });

    setTimeout(() => {
        log("5️⃣ setTimeout (Macrotask)");
    }, 0);

    log("2️⃣ Sync End");
}

function saveHistory(city) {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }

    loadHistory();
}

function loadHistory() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";

    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    cities.forEach(city => {
        const btn = document.createElement("button");
        btn.innerText = city;
        btn.onclick = () => {
            document.getElementById("cityInput").value = city;
            fetchWeather();
        };
        historyDiv.appendChild(btn);
    });
}

loadHistory();