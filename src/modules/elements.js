function createIcon(...className) {
  const span = document.createElement("span");
  const i = document.createElement("i");

  className.forEach((name) => {
    i.classList.add(name);
  });
  span.append(i);
  return span;
}

function createDiv(text, ...className) {
  const textValue = text === undefined ? "" : text;
  const div = document.createElement("div");
  className.forEach((el) => {
    div.classList.add(el);
  });
  div.textContent = textValue;
  return div;
}

export function createHourlyElement(hourlyWeather) {
  const hourylElement = createDiv("", "hourly-weather-item");
  const time = createDiv(hourlyWeather.time, "time");
  const className = hourlyWeather.night
    ? `wi-owm-night-${hourlyWeather.id}`
    : `wi-owm-day-${hourlyWeather.id}`;
  const iconWeather = createIcon("wi", className);
  const temp = createDiv(`${hourlyWeather.temp}°`, "temp");
  // Chance of rain
  const popContainer = createDiv("", "pop-container");
  const iconRain = createIcon("wi", "wi-raindrops");
  const pop = createDiv(`${hourlyWeather.pop}%`, "pop");
  popContainer.append(iconRain, pop);
  hourylElement.append(time, iconWeather, temp, popContainer);
  return hourylElement;
}

export function createDailyElement(dailyWeather) {
  const dailyElement = createDiv("", "daily-weather-item");
  const weekday = createDiv(dailyWeather.weekdayLong, "weekday");
  const className = dailyWeather.night
    ? `wi-owm-night-${dailyWeather.id}`
    : `wi-owm-day-${dailyWeather.id}`;
  const iconWeather = createIcon("wi", className);
  iconWeather.classList.add("weather-icon");
  const tempMax = createDiv(`${dailyWeather.tempMax}°`, "temp", "max");
  const tempMin = createDiv(`${dailyWeather.tempMin}°`, "temp", "min");
  // Chance of rain
  const popContainer = createDiv("", "pop-container");
  const iconRain = createIcon("wi", "wi-raindrops");
  const pop = createDiv(`${dailyWeather.pop}%`, "pop");
  popContainer.append(iconRain, pop);
  dailyElement.append(weekday, popContainer, iconWeather, tempMax, tempMin);
  return dailyElement;
}
