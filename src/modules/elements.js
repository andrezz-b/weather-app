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

function createIconContainer(test, data) {
  const container = createDiv("", "icon-container");
  const title = document.createElement("h1");
  let dataDiv;
  let icon;

  // eslint-disable-next-line default-case
  switch (test) {
    case "wind":
      title.textContent = "Wind Speed";
      // TODO: When it's in imeprial needs to check to change to mph
      dataDiv = createDiv(`${data} km/h`, "wind-speed");
      icon = createIcon("fas", "fa-wind");
      break;
    case "humidity":
      title.textContent = "Humidity";
      dataDiv = createDiv(`${data}%`, "humidity");
      icon = createIcon("wi", "wi-humidity");
      break;
    case "rain":
      title.textContent = "Chance of rain";
      dataDiv = createDiv(`${data}%`, "pop");
      icon = createIcon("wi", "wi-raindrops");
      break;
  }
  container.append(icon, title, dataDiv);
  return container;
}

export function createCurrentWeatherElement(currentWeather) {
  const weatherElement = createDiv("", "current-weather-container");

  // Left column
  const columnLeft = createDiv();
  // Temperature + weather icon
  const tempContainer = createDiv("", "temp-container");
  const temp = createDiv(`${currentWeather.temp}°`, "temp");
  const weatherIcon = createIcon("wi", `wi-owm-${currentWeather.id}`);
  tempContainer.append(temp, weatherIcon);
  // City
  const city = createDiv(currentWeather.name, "city");
  // Date
  const date = createDiv(`${currentWeather.weekdayShort}, ${currentWeather.time}`);
  // Temperature feels like
  const feelsLike = createDiv(`Feels like   ${currentWeather.feels_like}°`);
  columnLeft.append(tempContainer, city, date, feelsLike);

  // Right column
  const columnRight = createDiv("", "icons");
  const windSpeed = createIconContainer("wind", currentWeather.wind_speed);
  const humidity = createIconContainer("humidity", currentWeather.humidity);
  const pop = createIconContainer("rain", currentWeather.pop);
  columnRight.append(windSpeed, humidity, pop);

  weatherElement.append(columnLeft, columnRight);
  return weatherElement;
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
