const weatherModule = (() => {
  const form = document.querySelector("#search-city");
  const input = form.querySelector("#city-name");

  async function fetchWeather(e) {
    const cityName = input.value;
    const data = await fetch();
  }

  const init = () => {
    form.addEventListener("submit", fetchWeather);
  };
})();
