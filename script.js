//weather api

function weatherApi() {
  const weatherApiKey = "7464d8f56ed30f0467bc4d7331befa80";
  const lat = 51.276560;
  const lon = -0.842150;
  const weatherFeed = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exlude=daily&appid=" + weatherApiKey;

  fetch(weatherFeed)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const currentTemp = data['current']['temp'] - 273.15;
      const currentFeelLike = data['current']['feels_like'] - 273.15;
      const sunrise = data['current']['sunrise'];
      const sunset = data['current']['sunset'];

    });

  const lastUpdated = date.getHours() + ":" + date.getMinutes();
  document.getElementById('lastUpdated').innerHTML = lastUpdated;
}

//current time

updateCurrentTime();

function correctTime(time) {
  if (time < 10) {
    return ("0" + time);
  }
  return time;
}

function updateCurrentTime() {
  let date = new Date();

  let hour = date.getHours();
  if (hour > 12) {
    hour -= 12;
  }
  let minute = date.getMinutes();
  let second = date.getSeconds();

  let correctedHour = correctTime(hour);
  let correctedMinute = correctTime(minute);
  let correctedSecond = correctTime(second);

  let currentTime = correctedHour + ":" + correctedMinute + ":" + correctedSecond;
  document.getElementById('time').innerHTML = currentTime;

  setTimeout(updateCurrentTime, 1000);
}

//time zones

function timeApi(timeZone) {
  const timeRequest = "http://worldtimeapi.org/api/timezone/" + timeZone;
  fetch(timeRequest)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let dateTime = data['datetime'];
      let time = dateTime.substring(11, 16);
      document.getElementById('timeZoneOutput').innerHTML = time;
    })
    .catch((error) => {
      document.getElementById('timeZoneOutput').innerHTML = "Error";
    });
}

function getTimeZone() { //called when enter button is pressed
  const timeZone = document.getElementById('timeZoneInput').value;
  if (timeZone != "") {
    timeApi(timeZone);
  }
}
