function getDate() {
  return new Date();
}

function capitalizeWeatherDesc(string) {
  let flag = false;
  let firstWord;
  let secondWord;

  for (let i = 0; i < string.length; i++) {
    if (string.charAt(i) == " ") {
      flag = true;
      firstWord = string.substring(0, i);
      secondWord = string.substring(i+1, string.length);
    }
  }

  if (flag) {
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1) + " " + secondWord.charAt(0).toUpperCase() + secondWord.slice(1);
  } else {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

//google services



//search

function search() {
  if (event.key == "Enter") {
    let query = document.getElementById('google-search-bar').value;
    let i = 0;
    let words = 0;
    let wordBeginning = 0;
    let queryWordsArr = [];

    while (i < query.length + 1) {
      if (query.charAt(i) == " " || i == query.length) {
        queryWordsArr[words] = query.substring(wordBeginning, i);
        wordBeginning = i + 1;
        words++;
      }
      i++;
    }

    let fullQuery = queryWordsArr[0];
    for (let j = 1; j < queryWordsArr.length; j++) {
      fullQuery += "+" + queryWordsArr[j];
    }

    console.log(fullQuery);
    window.open("https://www.google.com/search?q=" + fullQuery)
  }
}

function swapSearchIcon() {
  let path = document.getElementById('search-icon').src;
  let i = path.length - 1;
  let slashCount = 0;

  while (slashCount < 2) {
    if (path.charAt(i) == "/") {
      slashCount++;
    }
    i--;
  }

  let localPath = path.slice(i + 2);

  if (localPath == "assets/search-icon.png") {
    document.getElementById('search-icon').src = "assets/swiftz-studioz.png";
    document.getElementById('search-icon').style.height = "50%";
    document.getElementById('google-search-bar').placeholder = "SwiftZ Search at your service!"
  } else {
    document.getElementById('search-icon').src = "assets/search-icon.png";
    document.getElementById('search-icon').style.height = "75%";
    document.getElementById('google-search-bar').placeholder = "Search Google";
  }
}

//news api

newsApi();

function newsApi() {
  const newsApiKey = "pub_63646ddb98584a445eb1e2bdf0d0c83d6021";
  const newsFeed = "https://newsdata.io/api/1/news?apikey=" + newsApiKey + "&domain=bbc&category=top";

  fetch(newsFeed)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      addNewsStory(data['results']['0']);
      addNewsStory(data['results']['1']);
      addNewsStory(data['results']['2']);
      addNewsStory(data['results']['3']);
      addNewsStory(data['results']['4']);
    })
    .catch((error) => {
      document.getElementById('news-container').innerHTML = "error - no news api credits remaining";
    });
}

function addNewsStory(news) {
  let tagElements = ["a", "h2"];
  let newsElements = ['title', 'description'];

  for (let i = 0; i < 2; i++) {
    let tag = document.createElement(tagElements[i]);
    let text = document.createTextNode(news[newsElements[i]]);
    tag.href = news['link'];
    tag.target = "_blank";
    tag.appendChild(text);
    let element = document.getElementById("news-container");
    element.appendChild(tag);
  }
}

//current time

updateCurrentTime();

function correctTime(time) {
  if (time < 10) {
    return ("0" + time);
  }
  return time;
}

function correctHour(hour) {
  if (hour > 12) {
    return (hour -= 12);
  }
  return hour;
}

function getCurrentTime() {
  let hour = getDate().getHours();
  let minute = getDate().getMinutes();
  let second = getDate().getSeconds();
  let currentTime = correctTime(correctHour(hour)) + ":" + correctTime(minute) + ":" + correctTime(second);
  return currentTime;
}

function updateCurrentTime() {
  let time = getCurrentTime();
  document.getElementById('time').innerHTML = time;
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

//weather api

weatherApi();

function weatherApi() {
  const weatherApiKey = "7464d8f56ed30f0467bc4d7331befa80";
  const lat = 51.276560;
  const lon = -0.842150;
  const weatherFeed = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exlude=daily&appid=" + weatherApiKey;

  fetch(weatherFeed)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setCurrentWeather(data['current']);
      setHourlyWeather(data['hourly']);
      setDailyWeather(data['daily']);
    });
}

function setCurrentWeather(data) {
  document.getElementById('weather-desc').innerHTML = capitalizeWeatherDesc(data['weather']['0']['description']);
  document.getElementById('wind-speed').innerHTML = "Wind: " + data['wind_speed'] + "ms⁻¹";
  document.getElementById('temperature').innerHTML = Math.round(data['temp'] - 273.15) + "°C";
  document.getElementById('feels-like').innerHTML = "Feels like " + Math.round(data['feels_like'] - 273.15) + "°C";

  let sunriseSeconds = data['sunrise'];
  let sunriseDate = new Date(sunriseSeconds*1000);
  let sunrise = correctTime(correctHour(sunriseDate.getHours())) + ":" + correctTime(correctHour(sunriseDate.getMinutes()));
  let sunsetSeconds = data['sunset'];
  let sunsetDate = new Date(sunsetSeconds*1000);
  let sunset = correctTime(correctHour(sunsetDate.getHours())) + ":" + correctTime(correctHour(sunsetDate.getMinutes()));
  document.getElementById('sunrise').innerHTML = "Sunrise: " + sunrise;
  document.getElementById('sunset').innerHTML = "Sunset: " + sunset;

  document.getElementById('current-weather-icon').src = "http://openweathermap.org/img/wn/" + data['weather']['0']['icon'] + "@2x.png";
}

function setHourlyWeather(data) {
  let time;
  for (let i = 0; i < 12; i++) {
    document.getElementById('hour+' + (i+1)).src = "http://openweathermap.org/img/wn/" + data[i]['weather']['0']['icon'] + "@2x.png";
    document.getElementById('hour+' + (i+1) + '-temp').innerHTML = Math.round(data[i]['temp'] - 273.15) + "°C";

    time = getDate().getHours() + (i+1);
    if(time > 23) {
      time -= 24;
    }
    document.getElementById('hourRange' + (i+1)).innerHTML = correctTime(time) + ":00";
  }
}

function setDailyWeather(data) {
  for (let i = 0; i < 5; i++) {
    document.getElementById('day' + (i+1) + '-weather-icon').src = "http://openweathermap.org/img/wn/" + data[i]['weather']['0']['icon'] + "@2x.png";
  }
}
