<?php
$cadena = exec("tail -2 out");
$patron1 = '/(.*)A: (\d\d):(\d\d):(\d\d) \/ (.*) \((.*)\)/';
preg_match($patron1, $cadena, $sustitucion1);

$res->pausa = false;
if ($sustitucion1[1] != '') {
    $res->pausa = true;
}

if (is_null($sustitucion1[0])) {
    $mom = 0;
    $res->dtini = '--:--:--';
    $res->dtfin = '--:--:--';
    $res->porcien = '0%';
} else {
    $mom = $sustitucion1[2] * 3600 + $sustitucion1[3] * 60 + $sustitucion1[4];
    $res->dtini = $sustitucion1[2] . ':' . $sustitucion1[3] . ':' . $sustitucion1[4];
    $res->dtfin = $sustitucion1[5];
    $res->porcien = $sustitucion1[6];
}



// $patron2 = '/(Chapter: \(.*\).*)/';
// $b = preg_match($patron2, $cadena, $sustitucion2);

// // if ($b === 1) {
// //     file_put_contents("chapter", "$sustitucion2[1]");
// // }
// // $chap = file_get_contents("chapter");

// $chap = $sustitucion2[1];

$entrada = json_decode(file_get_contents('playing'));
$patron = '/([^-]*) - (.*)\.MKA/';
preg_match($patron, $entrada->name, $result);
$patron = '/(.*), (.*), (.*), (.*), (.*)/';
preg_match($patron, $entrada->stream, $formato);

$numcaps = sizeof($entrada->caps);

$i = 0;
while ($mom > $entrada->caps[$i]->ini && $i < $numcaps) {
    ++$i;
}


$res->info .= 'Track ' . $entrada->caps[$i - 1]->cap . '/' . $numcaps . ': ' . $entrada->caps[$i - 1]->tit . '<br>';
$res->info .= '<br><b><u>' . $result[1] . '</u><br>' . $result[2] . '</b><br><br>';
$res->info .= $formato[1] . ', ' . $formato[2] . '<br>';
$res->info .= $formato[3] . ', ' . $formato[4] . '<br>';
$res->info .= $formato[5] . '<hr>';
$res->info .= 'Temp: ' . shell_exec("awk '{printf(\"%.1f\",$1/1000)}' /etc/armbianmonitor/datasources/soctemp") . 'º';

echo json_encode($res);
//$res.pausa
//$res.ini
//$res.dtini
//$res.dtfin
//$res.porcien
//$res.info
