const apiKey = "941e95dd90794c60b4043d78e5da6f6c";
const fix = "https://cors-anywhere.herokuapp.com/";
const newsFeed = fix + "https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=" + apiKey;

function displayNews() {
  fetch(newsFeed, {headers: new Headers({"X-Requested-with":"ehh..."})})
  .then(a => a.json())
  .then(response => {
    for (let i = 0; i < response.articles.length; i++) {
      document.getElementById("news-container").innerHTML += "<div style='padding-top: 20px;'><img style='float: left; width: 150px;' src='" + response.artcles[i].urlToImage + "'><h1>" + response.articles[i].title + "</h1>" + response.articles[i].source.name + "<br>" + response.articles[i].description + " <a href='" + response.articles[i].url+"' target='_blank'>" + response.articles[i].url + "</a></div>";

    }
  })
}

displayNews(newsFeed);
