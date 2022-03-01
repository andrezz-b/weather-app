import PubSub from "pubsub-js";
import { createHourlyElement, createDailyElement } from "./elements";
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

  function changeHourlyWeatherUnit() {
    const hours = Array.from(document.querySelector("#hourly-container").children);
    hours.forEach((hour) => {
      const displayUnit = weatherModule.getDisplayUnit();
      const temp = hour.querySelector(".temp");
      temp.textContent = `${convertTemperature(
        displayUnit,
        parseInt(temp.textContent.slice(0, -1), 10),
      )}°`;
    });
  }

  function changeDailyWeatherUnit() {
    const days = Array.from(document.querySelector("#daily-container").children);
    days.forEach((day) => {
      const displayUnit = weatherModule.getDisplayUnit();
      const tempMax = day.querySelector(".temp.max");
      const tempMin = day.querySelector(".temp.min");
      tempMax.textContent = `${convertTemperature(
        displayUnit,
        parseInt(tempMax.textContent.slice(0, -1), 10),
      )}°`;
      tempMin.textContent = `${convertTemperature(
        displayUnit,
        parseInt(tempMin.textContent.slice(0, -1), 10),
      )}°`;
    });
  }

  function renderCurrentWeather(currentWeather) {
    const container = document.querySelector(".current-weather-container");
    container.querySelector(".temp").textContent = `${currentWeather.temp}°`;
    const className = currentWeather.night
      ? `wi wi-owm-night-${currentWeather.id}`
      : `wi wi-owm-day-${currentWeather.id}`;
    container.querySelector(".wi").setAttribute("class", className);
    container.querySelector(".city").textContent = `${currentWeather.name}`;
    container.querySelector(
      ".date",
    ).textContent = `${currentWeather.weekdayShort}, ${currentWeather.time}`;
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

  function renderDailyWeather(dailyWeather) {
    const container = document.querySelector("#daily-container");
    Array.from(container.children).forEach((child) => {
      child.remove();
    });
    dailyWeather.forEach((day) => {
      const dailyWeatherElement = createDailyElement(day);
      container.append(dailyWeatherElement);
    });
  }

  async function renderWeather() {
    const data = await weatherModule.fetchWeather();
    const currentWeather = weatherModule.getCurrentWeather(data);
    const hourlyWeather = weatherModule.getHourlyWeather(data);
    const dailyWeather = weatherModule.getDailyWeather(data);

    renderCurrentWeather(currentWeather);
    renderHourlyWeather(hourlyWeather);
    renderDailyWeather(dailyWeather);
  }

  function changeDisplayUnit() {
    changeDailyWeatherUnit();
    changeCurrentWeatherUnit();
    changeHourlyWeatherUnit();
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
