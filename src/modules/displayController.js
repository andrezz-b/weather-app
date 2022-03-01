import PubSub from "pubsub-js";
import { createHourlyElement } from "./elements";
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

  function renderCurrentWeather(currentWeather) {
    const container = document.querySelector(".current-weather-container");
    container.querySelector(".temp").textContent = `${currentWeather.temp}°`;
    const className = currentWeather.night ? `wi wi-owm-night-${currentWeather.id}` : `wi wi-owm-day-${currentWeather.id}`;
    container.querySelector(".wi").setAttribute("class", className);
    container.querySelector(".city").textContent = `${currentWeather.name}`;
    container.querySelector(".date").textContent = `${currentWeather.weekdayShort}, ${currentWeather.time}`;
    container.querySelector(".feels").textContent = `Feels like ${currentWeather.feels_like}°`;
    container.querySelector(".wind-speed").textContent = weatherModule.getDisplayUnit() === "metric"
      ? `${currentWeather.wind_speed} km/h`
      : `${currentWeather.wind_speed} mph`;
    container.querySelector(".humidity").textContent = `${currentWeather.humidity}%`;
    container.querySelector(".pop").textContent = `${currentWeather.pop}%`;
  }

  function renderHourlyWeather(hourlyWeather) {
    const container = document.querySelector("#hourly-container");
    Array.from(container.children).forEach((child) => {
      child.remove();
    });
    hourlyWeather.forEach((hour) => {
      const hourlyWeatherElement = createHourlyElement(hour);
      container.append(hourlyWeatherElement);
    });
  }

  async function renderWeather() {
    const data = await weatherModule.fetchWeather();
    const currentWeather = weatherModule.getCurrentWeather(data);
    const hourlyWeather = weatherModule.getHourlyWeather(data);

    renderCurrentWeather(currentWeather);
    renderHourlyWeather(hourlyWeather);
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
