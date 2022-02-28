import londonData from "./londonDataTemp";

const weatherModule = (() => {
  const form = document.querySelector("#search-city");
  const input = form.querySelector("#city-name");

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

  const init = () => {
    form.addEventListener("submit", fetchWeather);
  };

  return {
    init,
  };
})();

console.log(londonData);

export default weatherModule;
