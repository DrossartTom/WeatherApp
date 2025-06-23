const key = "9f2983fdb06848047c39ea639ad811cc";
const form = document.querySelector("form");
const cityInput = document.getElementById("City");
const tbody = document.querySelector("tbody");

form.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    let enteredCity = cityInput.value.trim();

    if (!enteredCity) {
        alert("Please enter a city.");
        return;
    }

    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${enteredCity}&appid=${key}`;
    let response = await fetch(url);

    if (response.ok) {
        tbody.innerHTML = "";
        let weatherData = await response.json();

        weatherData.list.forEach(weatherFor3Hours => {
            const description = weatherFor3Hours.weather[0].description.toLowerCase();

            // Bepaal welk icoon er getoond moet worden
            let icon = "❓";
            if (description.includes("rain")) {
                icon = "🌧️";
            } else if (description.includes("clear")) {
                icon = "☀️";
            } else if (description.includes("cloud")) {
                icon = "☁️";
            } else if (description.includes("snow")) {
                icon = "❄️";
            } else if (description.includes("storm") || description.includes("thunder")) {
                icon = "⛈️";
            } else if (description.includes("mist") || description.includes("fog")) {
                icon = "🌫️";
            }

            tbody.innerHTML += `
            <tr>
                <td>${weatherFor3Hours.dt_txt}</td>
                <td>${(weatherFor3Hours.main.temp - 273.15).toFixed(1)}</td>
                <td>${description}</td>
                <td>${icon}</td>
            </tr>`;
        });
    } else {
        alert("City not found. Please try again.");
    }
});
