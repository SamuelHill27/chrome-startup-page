<?php

  getDatabase();

  class Shortcut {
    // Properties
    public $id;
    public $title;
    public $imageUrl;

    // Constructor
    function __construct($id, $title, $imageUrl) {
      $this->id = $id;
      $this->title = $title;
      $this->imageUrl = $imageUrl;
    }

    // Methods
    function get_id() {
      return $this->id;
    }

    function get_title() {
      return $this->title;
    }

    function get_imageUrl() {
      return $this->imageUrl;
    }
  }

  function openDatabase() {
    $db_host='fdb32.awardspace.net'; //Should contain the "Database Host" value
    $db_name='4080778_database'; //Should contain the "Database Name" value
    $db_user='4080778_database'; //Should contain the "Database User" value
    $db_pass='Jeffery123'; //Should contain the "Database Password" value

    $mysqli_connection = new MySQLi($db_host, $db_user, $db_pass, $db_name);

    if ($mysqli_connection->connect_error) {
      echo "Could not connect to $db_user, error: " . $mysqli_connection->connect_error;
      return null;
    } else {
      return $mysqli_connection;
    }
  }

  function getDatabase() {
    $mysqli_connection = openDatabase();

    if ($mysqli_connection != null) {
      $shortcutquery = "SELECT * FROM shortcuts";
      $shortcutquery_result = mysqli_query($mysqli_connection, $shortcutquery);

      $shortcuts = array();

      while($shortcutrow = mysqli_fetch_array($shortcutquery_result))
      {
        array_push($shortcuts, new Shortcut($shortcutrow["id"], $shortcutrow["title"], $shortcutrow["image_url"]));
      }

      echo json_encode($shortcuts);

      $mysqli_connection->close();
    }
  }

  function updateDatabase() {

  }

?>
