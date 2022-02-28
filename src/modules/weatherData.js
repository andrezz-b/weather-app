/* eslint-disable camelcase */
import londonData from "./londonDataTemp";

const weatherModule = (() => {
  const form = document.querySelector("#search-city");
  const input = form.querySelector("#city-name");

  function convertTime(unixTime) {
    const inputDate = new Date(unixTime * 1000);
    const date = {
      weekdayLong: Intl.DateTimeFormat("en", {
        weekday: "long",
      }).format(inputDate),
      weekdayShort: Intl.DateTimeFormat("en", {
        weekday: "short",
      }).format(inputDate),
      time: Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).format(inputDate),
    };
    return date;
  }

  async function fetchWeather() {
    try {
      const cityName = input.value;
      input.value = "";
      const [{ lat, lon }] = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=a2b73bbf19c4525e272278eaecbef43d`,
        { mode: "cors" },
      ).then((response) => response.json());
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=a2b73bbf19c4525e272278eaecbef43d`,
        { mode: "cors" },
      ).then((response) => response.json());
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  function getCurrentWeather(data) {
    const {
      dt, temp, feels_like, humidity, wind_speed,
    } = data.current;
    const { weekdayShort, time } = convertTime(dt);
    const { id } = data.current.weather[0];
    const { pop } = data.hourly[0];
    const currentWeather = {
      pop,
      weekdayShort,
      time,
      temp,
      feels_like,
      humidity,
      wind_speed,
      id,
    };
    console.log(currentWeather);
    return currentWeather;
  }

  const init = () => {
    form.addEventListener("submit", fetchWeather);
  };

  return {
    init,
    getCurrentWeather,
  };
})();

weatherModule.getCurrentWeather(londonData);

export default weatherModule;
