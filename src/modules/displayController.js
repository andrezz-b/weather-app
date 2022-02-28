import PubSub from "pubsub-js";
import { convertTemperature, convertWindSpeed } from "./utils";
import weatherModule from "./weatherData";

const displayController = (() => {
  const changeUnitBtn = document.querySelector("#change-display-unit");

  function changeCurrentWeatherUnit() {
    const displayUnit = weatherModule.getDisplayUnit();
    const container = document.querySelector(".current-weather-container");
    const temp = container.querySelector(".temp");
    const feels = container.querySelector(".feels");
    const windSpeed = container.querySelector(".wind-speed");
    temp.textContent = `${convertTemperature(
      displayUnit,
      parseInt(temp.textContent.slice(0, -1), 10),
    )}°`;
    feels.textContent = `Feels like ${convertTemperature(
      displayUnit,
      parseInt(feels.textContent.split(" ")[2].slice(0, -1), 10),
    )}°`;
    windSpeed.textContent = convertWindSpeed(displayUnit, windSpeed.textContent);
  }

  async function renderWeather() {
    const data = weatherModule.getCurrentWeather(await weatherModule.fetchWeather());
    const container = document.querySelector(".current-weather-container");
    container.querySelector(".temp").textContent = `${data.temp}°`;
    container.querySelector(".wi").setAttribute("class", `wi wi-owm-${data.id}`);
    container.querySelector(".city").textContent = `${data.name}`;
    container.querySelector(".date").textContent = `${data.weekdayShort}, ${data.time}`;
    container.querySelector(".feels").textContent = `Feels like ${data.feels_like}°`;
    container.querySelector(".wind-speed").textContent = weatherModule.getDisplayUnit() === "metric"
      ? `${data.wind_speed} km/h`
      : `${data.wind_speed} mph`;
    container.querySelector(".humidity").textContent = `${data.humidity}%`;
    container.querySelector(".pop").textContent = `${data.pop}%`;
  }

  function changeDisplayUnit() {
    changeCurrentWeatherUnit();
    weatherModule.changeDisplayUnit();
    const displayUnit = weatherModule.getDisplayUnit();
    changeUnitBtn.textContent = displayUnit === "metric" ? "Celsius" : "Fahrenheit";
  }

  function init() {
    changeUnitBtn.addEventListener("click", changeDisplayUnit);
    PubSub.subscribe("new-city", renderWeather);
  }

  return {
    init,
  };
})();

export default displayController;
