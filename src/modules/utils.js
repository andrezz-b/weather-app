export function convertTemperature(displayUnit, value) {
  if (displayUnit === "metric") {
    return Math.round(value * 1.8 + 32);
  }
  if (displayUnit === "imperial") {
    return Math.round((value - 32) / 1.8);
  }
  return NaN;
}

export function convertWindSpeed(displayUnit, string) {
  if (displayUnit === "metric") {
    const speed = parseInt(string.slice(0, -5), 10);
    const speedConvert = Math.round((speed / 1.609344));
    return `${speedConvert} mph`;
  }
  if (displayUnit === "imperial") {
    const speed = parseInt(string.slice(0, -4), 10);
    const speedConvert = Math.round((speed * 1.609344));
    return `${speedConvert} km/h`;
  }
  return NaN;
}

export function convertTime(unixTime) {
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
