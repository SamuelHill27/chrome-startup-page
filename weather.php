<?php

  $key = "7464d8f56ed30f0467bc4d7331befa80";
  $lat = 51.276560;
  $lon = -0.842150;
  $url = "https://api.openweathermap.org/data/2.5/onecall?lat=" . $lat . "&lon=" . $lon . "&exlude=daily&appid=" . $key;
  $data = file_get_contents(urlencode($url));
  echo $url;
  echo urlencode($url);
  echo $data;

?>