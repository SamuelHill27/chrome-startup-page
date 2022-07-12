getShortcuts();
getNews();
updateCurrentTime();
getDate();
getWeather();

var currentShortcut;

function getCurrentDate() {
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
    window.open("https://www.google.com/search?q=" + fullQuery,"_self")
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
    document.getElementById('search-title').innerHTML = "SwiftZ";
  } else {
    document.getElementById('search-icon').src = "assets/search-icon.png";
    document.getElementById('search-icon').style.height = "75%";
    document.getElementById('google-search-bar').placeholder = "Search Google";
    document.getElementById('search-title').innerHTML = "Google";
  }
}

//Shortcuts

function getShortcuts() {
  fetch("getShortcuts.php", {method: 'GET'})
    .then(response => response.json())
    .then((data) => {
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        document.getElementById('shortcut-text-' + (i+1)).innerHTML = data[i]['title'];
        document.getElementById('shortcut-image-' + (i+1)).src = data[i]['imageUrl'];
        document.getElementById('shortcut-address-' + (i+1)).href = data[i]['websiteUrl'];
      }

    });
}

function updateShortcut() {
  let newTitle = document.getElementById('newShortcutText').value;
  let newImage = document.getElementById('newShortcutImage').value;
  let newUrl = document.getElementById('newShortcutUrl').value;

  if (newTitle == "") {
    newTitle = "Shortcut " + currentShortcut;
  }

  if (newImage == "") {
    newImage = "assets/shortcut-placeholder-image.png";
  }

  let array = [currentShortcut, newTitle, newImage, newUrl];

  console.log(array);

  fetch('setShortcuts.php', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(array),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      getShortcuts();
    })
    .catch(error => {
      console.error("not working");
      console.error('Error:', error);
    });

   overlayOff();
}

function overlayOn(shortcutNo) {
  currentShortcut = shortcutNo;
  document.getElementById("overlay").style.display = "flex";
}

function overlayOff() {
  document.getElementById('overlay').style.display = "none";
}

//news api

function getNews() {
  const newsApiKey = "pub_63646ddb98584a445eb1e2bdf0d0c83d6021";
  const newsFeedTop = "https://newsdata.io/api/1/news?apikey=" + newsApiKey + "&domain=bbc&category=top";
  const newsFeed = "https://newsdata.io/api/1/news?apikey=" + newsApiKey + "&domain=bbc&category=business,science,health,entertainment,technology";
  const newsFeedNextPage = "https://newsdata.io/api/1/news?apikey=" + newsApiKey + "&domain=bbc&category=business,science,health,entertainment,technology&page=1";

  fetchNews(newsFeedTop);
  fetchNews(newsFeed);
  fetchNews(newsFeedNextPage);
}

function fetchNews(newsFeed) {
  fetch(newsFeed)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let newsStory;
      for (let i = 0; i < data['results'].length; i++) {
        addNewsStory(data['results'][i]);
      }
    })
    .catch((error) => {
      document.getElementById('news-container').innerHTML = "error - no news api credits remaining";
    });
}

function addNewsStory(news) {
  let tagElements = ["a", "h2"];
  let newsElements = ['title', 'description'];

  let div = document.createElement("div")
  div.className = "news-story";

  for (let i = 0; i < 2; i++) {
    let tag = document.createElement(tagElements[i]);
    let text = document.createTextNode(news[newsElements[i]]);
    tag.href = news['link'];
    tag.target = "_blank";
    tag.appendChild(text);
    div.appendChild(tag);
  }

  let element = document.getElementById("news-container");
  element.appendChild(div);
}

//current time

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
  let hour = getCurrentDate().getHours();
  let minute = getCurrentDate().getMinutes();
  let second = getCurrentDate().getSeconds();
  let currentTime = correctTime(correctHour(hour)) + ":" + correctTime(minute) + ":" + correctTime(second);
  return currentTime;
}

function updateCurrentTime() {
  let time = getCurrentTime();
  document.getElementById('time').innerHTML = time;
  setTimeout(updateCurrentTime, 1000);
}

//current date

function getDate() {
const date = getCurrentDate();

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day = days[date.getDay()];

let dayOfMonth = date.getDate();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let month = months[date.getMonth()];

let year = date.getFullYear();

document.getElementById('date').innerHTML = day + " " + dayOfMonth + " " + month + " " + year;
}

//weather api

function getWeather() {
  $(document).ready(function(){
    $.get("weather.php", function(dataString, status){ //AJAX get request

      let data = JSON.parse(dataString); //put into json format
      console.log(data);

      //current weather
      $("#weather-desc").html(capitalizeWeatherDesc(data['current']['weather']['0']['description']));
      $('#wind-speed').html("Wind: " + data['current']['wind_speed'] + "ms⁻¹");
      $('#temperature').html(Math.round(data['current']['temp'] - 273.15) + "°C");
      $('#feels-like').html(Math.round(data['current']['feels_like'] - 273.15) + "°C");
      $('#current-weather-icon').attr("src", "http://openweathermap.org/img/wn/" + data['current']['weather']['0']['icon'] + "@2x.png");

      //sunrise and sunset
      let sunriseSeconds = data['current']['sunrise'];
      let sunriseDate = new Date(sunriseSeconds*1000);
      let sunrise = correctTime(correctHour(sunriseDate.getHours())) + ":" + correctTime(correctHour(sunriseDate.getMinutes()));
      let sunsetSeconds = data['current']['sunset'];
      let sungetDate = new Date(sunsetSeconds*1000);
      let sunset = correctTime(correctHour(sungetDate.getHours())) + ":" + correctTime(correctHour(sungetDate.getMinutes()));

      $('#sunrise').html("Sunrise: " + sunrise);
      $('#sunset').html("Sunset: " + sunset);

      //hourly weather
      let time;
      for (let i = 0; i < 12; i++) {
        $('#hour' + (i+1)).attr("src", "http://openweathermap.org/img/wn/" + data['hourly'][i]['weather']['0']['icon'] + "@2x.png"); //sets hourly weather icon
        $('#hour' + (i+1) + 'Temp').html(Math.round(data['hourly'][i]['temp'] - 273.15) + "°C"); //sets hourly weather temperature

        time = getCurrentDate().getHours() + (i+1); //ensures correct 24 hour range
        if(time > 23) {
          time -= 24;
        }

        $('#hourRange' + (i+1)).html(correctTime(correctHour(time)) + ":00"); //sets hourly time
      }

      //daily weather
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentDay = getCurrentDate().getDay();

      for (let i = 0; i < 5; i++) {
        let dayAtIndex = currentDay + 1 + i;
        if (dayAtIndex > 6) {
          dayAtIndex -= 7;
        }

        let day = days[dayAtIndex];
        $('#day' + (i+1)).html(day);
        $('#day' + (i+1) + 'WeatherIcon').attr("src", "http://openweathermap.org/img/wn/" + data['daily'][i+1]['weather']['0']['icon'] + "@2x.png");
      }

    });
  });
}
