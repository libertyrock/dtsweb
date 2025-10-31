<?php
include 'config.php';
$name=$_POST["id"];
if ($name === null) {
  $res='nop';
} else {
  $file=$path.$name;
  
  $orden='ffmpeg -i "'.$file.'" -f ffmetadata 2>&1';
  $salida=shell_exec($orden);
  
  $patron = '/.*Chapter #0:(\d+): start (.*), end (.*)\n.*Metadata:\n.*title.*: (.*)/';
  preg_match_all($patron, $salida, $capitulos, PREG_SET_ORDER);
  
  $patron = '/([^-]*) - (.*)\.MKA/';
  preg_match($patron, $name, $filename);
  
  $patron = '/Stream #0:0.*: Audio: (.*)/';
  preg_match($patron, $salida, $informacion);
  
  $res=[];
  $res['name']=$name;
  $res['artist']=$filename[1];
  $res['album']=$filename[2];
  $res['info']=$informacion[1];
  
  $i=0;
  foreach ($capitulos as $val) {
      $res['caps'][$i] = [
        'cap' => $val[1]+1,
        'ini' => round($val[2]),
        'fin' => round($val[3]),
        'tit' => $val[4]
      ];
      ++$i;
  }
  
  //$res.name
  //$res.artist
  //$res.album
  //$res.info[0-4]
  //$res.caps[] cap,ini,fin,tit
}
echo json_encode($res);
