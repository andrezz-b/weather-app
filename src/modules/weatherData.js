/* eslint-disable camelcase */
import PubSub from "pubsub-js";
import { convertTime } from "./utils";

const weatherModule = (() => {
  const form = document.querySelector("#search-city");
  const input = form.querySelector("#city-name");
  let displayUnit = "metric";

  function changeDisplayUnit() {
    displayUnit = displayUnit === "metric" ? "imperial" : "metric";
  }

  function getDisplayUnit() {
    return displayUnit;
  }

  async function fetchWeather() {
    try {
      const cityName = input.value === "" ? "London" : input.value;
      input.value = "";
      const [{ lat, lon, name }] = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=a2b73bbf19c4525e272278eaecbef43d`,
        { mode: "cors" },
      ).then((response) => response.json());
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=${displayUnit}&appid=a2b73bbf19c4525e272278eaecbef43d`,
        { mode: "cors" },
      ).then((response) => response.json());
      data.name = name;
      return data;
    } catch (err) {
      console.log(err);
      return -1;
    }
  }

  function getCurrentWeather(data) {
    const { dt, humidity } = data.current;
    const { weekdayShort, time } = convertTime(dt);
    const { id } = data.current.weather[0];
    const night = data.current.weather[0].icon.charAt(2) === "n";
    const pop = Math.round(data.hourly[0].pop * 100);
    const { name } = data;
    const { time: sunrise } = convertTime(data.daily[0].sunrise);
    const { time: sunset } = convertTime(data.daily[0].sunset);
    const temp = Math.round(data.current.temp);
    const feels_like = Math.round(data.current.feels_like);
    const wind_speed = getDisplayUnit() === "metric"
      ? Math.round(data.current.wind_speed * (18 / 5))
      : Math.round(data.current.wind_speed);
    const currentWeather = {
      sunrise,
      sunset,
      night,
      name,
      pop,
      weekdayShort,
      time,
      temp,
      feels_like,
      humidity,
      wind_speed,
      id,
    };
    return currentWeather;
  }

  function getHourlyWeather(data) {
    const hourlyWeather = [];
    for (let i = 0; i < 25; i += 1) {
      const hour = data.hourly[i];
      const { time } = convertTime(hour.dt);
      const object = {
        pop: Math.round(hour.pop * 100),
        temp: Math.round(hour.temp),
        night: hour.weather[0].icon.charAt(2) === "n",
        id: hour.weather[0].id,
        time,
      };
      hourlyWeather.push(object);
    }
    return hourlyWeather;
  }

  function getDailyWeather(data) {
    const dailyWeather = [];
    data.daily.forEach((day) => {
      const { weekdayLong } = convertTime(day.dt);
      const { min, max } = day.temp;
      const object = {
        tempMax: Math.round(max),
        tempMin: Math.round(min),
        weekdayLong,
        night: day.weather[0].icon.charAt(2) === "n",
        id: day.weather[0].id,
        pop: Math.round(day.pop * 100),
      };
      dailyWeather.push(object);
    });
    return dailyWeather;
  }

  function init() {
    form.addEventListener("submit", () => {
      PubSub.publish("new-city");
    });
    PubSub.publish("new-city");
  }

  return {
    init,
    getCurrentWeather,
    fetchWeather,
    getDisplayUnit,
    changeDisplayUnit,
    getHourlyWeather,
    getDailyWeather,
  };
})();
export default weatherModule;
