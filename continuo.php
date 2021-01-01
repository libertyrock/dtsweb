<?php
include 'config.php';
$cadena = exec('tail -2 ' . $pt . 'out');
$patron1 = '/(.*)A: (\d\d):(\d\d):(\d\d) \/ (\d\d):(\d\d):(\d\d) \((.*)\)/';
preg_match($patron1, $cadena, $sustitucion1);

$res->pausa = false;
if ($sustitucion1[1] != '') {
    $res->pausa = true;
}

$in = json_decode(file_get_contents($pt . 'playing'));
$numcaps = sizeof($in->caps);
$res->name = $in->name;

if (is_null($sustitucion1[0])) {
    $mom = 0;
    $res->dtini = '--:--:--';
    $res->dtfin = '--:--:--';
    $res->dtcap = 'Total<br>Tracks: ' . $numcaps;
    $res->titcap = '';
    $res->cporcien = 0;
    $res->porcien = 0;
    $res->playing = false;
} else {
    $mom = $sustitucion1[2] * 3600 + $sustitucion1[3] * 60 + $sustitucion1[4];
    $res->dtini = $sustitucion1[2] . ':' . $sustitucion1[3] . ':' . $sustitucion1[4];
    $res->dtfin = $sustitucion1[5] . ':' . $sustitucion1[6] . ':' . $sustitucion1[7];
    $res->porcien = $mom * 100 / $in->caps[$numcaps - 1]->fin; //$sustitucion1[6];
    $res->ms = $mom;
    $res->fs = $in->caps[$numcaps - 1]->fin;
    $i = 0;
    while ($mom + 1 >= $in->caps[$i]->ini && $i < $numcaps) {
        ++$i;
    }

    $res->dtcap = 'Track ' . $in->caps[$i - 1]->cap . '/' . $numcaps . '<br>';
    $res->titcap = '<b>' . $in->caps[$i - 1]->tit . '</b>';
    $res->cporcien = ($mom - $in->caps[$i - 1]->ini) * 100 / ($in->caps[$i - 1]->fin - $in->caps[$i - 1]->ini);
    $res->playing = true;
    $res->capnum=$i-1;
}

echo json_encode($res);
//$res.pausa
//$res.dtini
//$res.dtfin
//$res.porcien
//$res.dtcap
//$res.titcap
//$res.cporcien
//$res.name
//$res.playing
//$res.capnum