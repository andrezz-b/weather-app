/* eslint-disable camelcase */

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
      const [{ lat, lon, name }] = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=a2b73bbf19c4525e272278eaecbef43d`,
        { mode: "cors" },
      ).then((response) => response.json());
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=a2b73bbf19c4525e272278eaecbef43d`,
        { mode: "cors" },
      ).then((response) => response.json());
      data.name = name;
      console.log(data);
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
    const pop = data.hourly[0].pop * 100;
    const { name } = data;
    const temp = Math.round(data.current.temp);
    const feels_like = Math.round(data.current.feels_like);
    const wind_speed = Math.round(data.current.wind_speed * (18 / 5) * 10) / 10;
    const currentWeather = {
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

  // async function render() {
  //   const container = document.querySelector("#current-weather");
  //   const child = container.firstElementChild;
  //   child.remove();
  //   const data = await fetchWeather();
  //   const currentWeatherEl = createCurrentWeatherElement(getCurrentWeather(data));
  //   container.append(currentWeatherEl);
  // }

  async function renderWithoutRemove() {
    const data = getCurrentWeather(await fetchWeather());
    const container = document.querySelector(".current-weather-container");
    container.querySelector(".temp").textContent = `${data.temp}°`;
    container.querySelector(".wi.wi-night-cloudy-high").class = `wi wi-owm-${data.id}`;
    container.querySelector(".city").textContent = `${data.name}`;
    container.querySelector(".date").textContent = `${data.weekdayShort}, ${data.time}`;
    container.querySelector(".feels").textContent = `Feels like ${data.feels_like}°`;
    container.querySelector(".wind-speed").textContent = `${data.wind_speed} km/h`;
    container.querySelector(".humidity").textContent = `${data.humidity}%`;
    container.querySelector(".pop").textContent = `${data.pop}%`;
  }

  const init = () => {
    form.addEventListener("submit", renderWithoutRemove);
  };

  return {
    init,
    getCurrentWeather,
  };
})();

export default weatherModule;
