<?php

  updateDatabase();

  function base64ToImageUrl($shortcutNo, $base64, $flipNo) {
    $filePath = "shortcutImages/shortcut" . $shortcutNo . "_" . $flipNo . ".png";

    // split the string on commas
    // $data[ 0 ] == "data:image/png;base64"
    // $data[ 1 ] == <actual base64 string>
    $data = explode(',', $base64);

    file_put_contents($filePath, base64_decode($data[1]));
    return $filePath;
  }

  function openDatabase() {
    $db_host='localhost:3306'; //Should contain the "Database Host" value
    $db_name='4080778_database'; //Should contain the "Database Name" value
    $db_user='root'; //Should contain the "Database User" value
    $db_pass=''; //Should contain the "Database Password" value

    $mysqli_connection = new MySQLi($db_host, $db_user, $db_pass, $db_name);

    if ($mysqli_connection->connect_error) {
      echo "{\"result\": \"Could not connect to $db_user, error " . $mysqli_connection->connect_error . "\"}";
      return null;
    } else {
      return $mysqli_connection;
    }
  }

  function updateDatabase() {
    $content = trim(file_get_contents("php://input"));
    $decoded = json_decode($content, true);

    $placeholder = "assets/shortcut-placeholder-image.png";
    $imageUrl;
    if ($decoded[2] == $placeholder) {
      $imageUrl = $placeholder;
    } else {
      $imageUrl = base64ToImageUrl($decoded[0], $decoded[2], $decoded[4]);
    }

    $mysqli_connection = openDatabase();
    $stmt;

    try {
      if ($mysqli_connection != null) {
        $stmt = mysqli_prepare($mysqli_connection, "UPDATE shortcuts SET title=?, image_url=?, website_url=? WHERE id=?");
        mysqli_stmt_bind_param($stmt, "sssi", $decoded[1], $imageUrl, $decoded[3], $decoded[0]);
        mysqli_stmt_execute($stmt);

        if (mysqli_stmt_execute($stmt)) {
          echo "{\"result\": \"success\"}";
        } else {
          echo "{\"result\": \"fail " . mysqli_error($mysqli_connection) . "\"}";
        }
      }
    } catch(Exception $e) {
      echo "{\"result\": \"exception thrown " . $e . "\"}";
    } finally {
      mysqli_stmt_close($stmt);
      mysqli_close($mysqli_connection);
    }
  }

?>
