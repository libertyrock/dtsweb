<?php
include 'config.php';
exec("pkill mpv");
exec("rm out");
$name=$_POST["id"];
$file=$path.$name;
$orden='mpv --input-file=tubo --no-video --audio-device alsa/iec958:CARD=DAC,DEV=0 --audio-spdif=ac3,dts "'.$file.'" 1> out 2>&1 &';
shell_exec($orden);

$orden='ffmpeg -i "'.$file.'" -f ffmetadata 2>&1';
$salida=shell_exec($orden);

$patron = '/.*Chapter #0:(\d+): start (.*), end (.*)\n.*Metadata:\n.*title.*: (.*)/';
preg_match_all($patron, $salida, $capitulos, PREG_SET_ORDER);
$patron = '/Stream #0:0.*: Audio: (.*)/';
preg_match($patron, $salida, $informacion);

$i=0;
$res->name=$name;
$res->stream=$informacion[1];
foreach ($capitulos as $val) {
    $res->caps[$i]->cap=$val[1]+1;
    $res->caps[$i]->ini=$val[2];
    $res->caps[$i]->fin=$val[3];
    $res->caps[$i]->tit=$val[4];
    ++$i;
}

file_put_contents("playing",json_encode($res));
//echo json_encode($res);
//$res.name
//$res.stream
//$res.caps cap,ini,fin,tit
