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

weatherApi();
