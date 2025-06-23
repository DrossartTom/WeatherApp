const key = "9f2983fdb06848047c39ea639ad811cc"; // OpenWeatherMap API key
const form = document.querySelector("form");
const cityInput = document.getElementById("City");
const tbody = document.querySelector("tbody");
const mapFrame = document.getElementById("mapFrame");

form.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const enteredCity = cityInput.value.trim();
  if (!enteredCity) {
    alert("Please enter a city.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${enteredCity}&appid=${key}`;
  const response = await fetch(url);

  if (response.ok) {
    const weatherData = await response.json();
    tbody.innerHTML = "";

    // Toon Google Maps via iframe embed
    const { lat, lon } = weatherData.city.coord;
    const embedUrl = `https://www.google.com/maps?q=${lat},${lon}&z=10&output=embed`;
    mapFrame.src = embedUrl;

    // Groepeer per dag (yyyy-mm-dd)
    const dailyData = {};

    weatherData.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          descriptions: [],
        };
      }
      dailyData[date].temps.push(entry.main.temp);
      dailyData[date].descriptions.push(entry.weather[0].description.toLowerCase());
    });

    // Functie om meest voorkomende beschrijving te vinden
    function mostCommon(arr) {
      return arr.sort((a,b) =>
            arr.filter(v => v===a).length
          - arr.filter(v => v===b).length
      ).pop();
    }

    // Toon per dag één rij
    for (const date in dailyData) {
      const tempsKelvin = dailyData[date].temps;
      // Bereken gemiddelde temperatuur °C
      const avgTempC = tempsKelvin.reduce((a,b) => a + b, 0) / tempsKelvin.length - 273.15;

      // Meest voorkomende beschrijving
      const description = mostCommon(dailyData[date].descriptions);

      // Kies icoon op basis van beschrijving
      let icon = "❓";
      if (description.includes("rain")) icon = "🌧️";
      else if (description.includes("clear")) icon = "☀️";
      else if (description.includes("cloud")) icon = "☁️";
      else if (description.includes("snow")) icon = "❄️";
      else if (description.includes("storm") || description.includes("thunder")) icon = "⛈️";
      else if (description.includes("mist") || description.includes("fog")) icon = "🌫️";

      tbody.innerHTML += `
        <tr>
          <td>${date}</td>
          <td>${avgTempC.toFixed(1)}</td>
          <td>${description}</td>
          <td style="font-size: 1.5rem;">${icon}</td>
        </tr>
      `;
    }
  } else {
    alert("City not found. Please try again.");
  }
});
