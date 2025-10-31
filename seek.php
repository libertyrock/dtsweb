<?php
include 'config.php';
$seconds=$_POST["seconds"];
//file_put_contents("tubo","seek $seconds absolute+keyframes\n");
$obj ??= new stdClass();
$obj->command=["seek",$seconds,"absolute+keyframes"];
$json=json_encode($obj);
$resultado=exec("echo '".$json."' | socat - ".$pt."tubo");
