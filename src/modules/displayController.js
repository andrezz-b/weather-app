const displayController = (() => {
  let displayUnit = "metric";
  const changeUnitBtn = document.querySelector("#change-display-unit");

  function changeDisplayUnit() {
    changeCurrentWeatherUnit();
    displayUnit = displayUnit === "metric" ? "imperial" : "metric";
    changeUnitBtn.textContent = displayUnit === "metric" ? "Celsius" : "Fahrenheit";
  }

  function getDisplayUnit() {
    return displayUnit;
  }

  function convertTemperature(value) {
    if (displayUnit === "metric") {
      return Math.round(value * 1.8 + 32);
    }
    if (displayUnit === "imperial") {
      return Math.round((value - 32) / 1.8);
    }
    return NaN;
  }

  function convertWindSpeed(string) {
    if (displayUnit === "metric") {
      const speed = parseInt(string.slice(0, -5), 10);
      const speedConvert = Math.round((speed / 1.609344) * 10) / 10;
      return `${speedConvert} mph`;
    }
    if (displayUnit === "imperial") {
      const speed = parseInt(string.slice(0, -4), 10);
      const speedConvert = Math.round((speed * 1.609344) * 10) / 10;
      return `${speedConvert} km/h`;
    }
    return NaN;
  }

  function changeCurrentWeatherUnit() {
    const container = document.querySelector(".current-weather-container");
    const temp = container.querySelector(".temp");
    const feels = container.querySelector(".feels");
    const windSpeed = container.querySelector(".wind-speed");
    temp.textContent = `${convertTemperature(parseInt(temp.textContent.slice(0, -1), 10))}°`;
    feels.textContent = `Feels like ${convertTemperature(parseInt(feels.textContent.split(" ")[2].slice(0, -1), 10))}°`;
    windSpeed.textContent = convertWindSpeed(windSpeed.textContent);
  }

  function init() {
    changeUnitBtn.addEventListener("click", changeDisplayUnit);
  }

  return {
    init,
    getDisplayUnit,
  };
})();

export default displayController;
