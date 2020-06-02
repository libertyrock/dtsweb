<?php
include 'config.php';
exec('rm salida ; ls -1a '.$path.'/*.MKA | xargs -d "\n" -n 1 basename > salida');
$gestor = @fopen('salida', 'r');
if ($gestor) {
    $i=0;

    $res->lista='<br><ul id="myUL" class="myUL">';
    while (($bufer = fgets($gestor, 4096)) !== false) {
        $bufer_limpio=addslashes(trim($bufer));
        ++$i;
        $res->lista.='<li class=w3-bar ontouchmove="touchmove(event,\''.$bufer_limpio.'\','.$i.');" >';
        $res->lista.='<button id=b'.$i.' class="w3-bar-item w3-red" onclick="play(\''.$bufer_limpio.'\',1);">|&gt;</button>';
        $res->lista.='<a class=w3-bar-item onclick="infoitem(\''.$bufer_limpio.'\');">'.$bufer.'</a></li>';
    }
    $res->lista.='</ul>';
    $res->count=$i;

    if (!feof($gestor)) {
        echo 'Error: fallo inesperado de fgets()\n';
    }
    fclose($gestor);
    
    echo json_encode($res);
    //$res.lista
    //$res.count
}
