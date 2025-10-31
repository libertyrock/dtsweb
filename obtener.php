<?php
include 'config.php';
if (!file_exists($pt.'playing')) {
  echo "El fichero NO existe";
} else {
  echo file_get_contents($pt.'playing');
}
//$res.name
//$res.artist
//$res.album
//$res.info[0-4]
//$res.caps[] cap,ini,fin,tit
