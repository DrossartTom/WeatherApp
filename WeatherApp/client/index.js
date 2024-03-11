const key = "9f2983fdb06848047c39ea639ad811cc";
const form = document.querySelector("form");
const stadInput = document.getElementById("Stad");
const tbody = document.querySelector("tbody")

form.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    let ingevuldeStad = stadInput.value;

    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${ingevuldeStad}&appid=${key}`;
    let response = await fetch(url);
    if (response.ok) {
        tbody.innerHTML = ""
        let weerberichtObject = await response.json();
        weerberichtObject.list.forEach(weerVoor3uur => {

            tbody.innerHTML += `
            <tr>
                <td>${weerVoor3uur.dt_txt}</td>
                <td>${(weerVoor3uur.main.temp - 273.15).toFixed(1)}</td>
                <td>${weerVoor3uur.weather[0].description}</td>
            </tr>`;
        });
    }

});
