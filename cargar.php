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
        $res->lista.='<li><a id=b'.$i.' onclick="play(\''.$bufer_limpio.'\',1);">'.$bufer.'</a></li>';
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
