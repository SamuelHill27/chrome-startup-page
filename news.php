<?php

  $key = "pub_63646ddb98584a445eb1e2bdf0d0c83d6021";

  $feedTop = "https://newsdata.io/api/1/news?apikey=" . $key . "&domain=bbc&category=top";
  $url1 = file_get_contents($feedTop);

  $feed = "https://newsdata.io/api/1/news?apikey=" . $key . "&domain=bbc&category=business,science,health,entertainment,technology";
  $url2 = file_get_contents($feed);

  $feedNextPage = "https://newsdata.io/api/1/news?apikey=" . $key . "&domain=bbc&category=business,science,health,entertainment,technology&page=1";
  $url3 = file_get_contents($feedNextPage);

  echo "{ \"feedTop\" : " . $url1 . ", \"feed\" : " . $url2 . ", \"feedNextPage\" : " . $url3 . "}";

?>
