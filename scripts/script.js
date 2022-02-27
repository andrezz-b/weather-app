const weatherModule = (() => {
  const form = document.querySelector("#search-city");
  const input = form.querySelector("#city-name");

  async function fetchWeather() {
    try {
      const cityName = input.value;
      input.value = "";
      const data = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a2b73bbf19c4525e272278eaecbef43d`, { mode: "cors" }).then((response) => response.json());
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

weatherModule.init();
