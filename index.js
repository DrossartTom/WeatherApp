const key = "9f2983fdb06848047c39ea639ad811cc"; // OpenWeatherMap API key
const form = document.querySelector("form");
const cityInput = document.getElementById("City");
const tbody = document.querySelector("tbody");
const mapFrame = document.getElementById("mapFrame");

// Handle form submission
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

    // Set Google Maps location
    const { lat, lon } = weatherData.city.coord;
    const embedUrl = `https://www.google.com/maps?q=${lat},${lon}&z=10&output=embed`;
    mapFrame.src = embedUrl;

    // Group data by day
    const dailyData = {};

    weatherData.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          descriptions: []
        };
      }
      dailyData[date].temps.push(entry.main.temp);
      dailyData[date].descriptions.push(entry.weather[0].description.toLowerCase());
    });

    function mostCommon(arr) {
      return arr
        .sort(
          (a, b) =>
            arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
        )
        .pop();
    }

    for (const date in dailyData) {
      const tempsKelvin = dailyData[date].temps;
      const avgTempC =
        tempsKelvin.reduce((a, b) => a + b, 0) / tempsKelvin.length - 273.15;

      const description = mostCommon(dailyData[date].descriptions);

      // Weather icon
      let icon = "❓";
      if (description.includes("rain")) icon = "🌧️";
      else if (description.includes("clear")) icon = "☀️";
      else if (description.includes("cloud")) icon = "☁️";
      else if (description.includes("snow")) icon = "❄️";
      else if (description.includes("storm") || description.includes("thunder")) icon = "⛈️";
      else if (description.includes("mist") || description.includes("fog")) icon = "🌫️";

      // Allergy estimation
      let allergyText = "Moderate risk: Dust, Mold";
      if (description.includes("rain") || description.includes("snow")) {
        allergyText = "Low risk (rain/snow)";
      } else if (description.includes("clear") && avgTempC >= 15) {
        allergyText = "High risk: Pollen, Grass";
      }

      // Append row
      tbody.innerHTML += `
        <tr>
          <td>${date}</td>
          <td>${avgTempC.toFixed(1)}</td>
          <td>${icon} ${description}</td>
          <td>${allergyText}</td>
        </tr>
      `;
    }
  } else {
    alert("City not found. Please try again.");
  }
});

// =====================
// DARK/LIGHT MODE TOGGLE
// =====================

const toggleBtn = document.createElement("button");
toggleBtn.id = "themeToggle";
toggleBtn.textContent = "🌙";
document.body.appendChild(toggleBtn);

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
