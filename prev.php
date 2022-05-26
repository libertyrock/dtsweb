<?php
//file_put_contents("tubo", "keypress !\n");
$obj->command=["keypress","!"];
$json=json_encode($obj);
$resultado=exec("echo '".$json."' | socat - /tmp/tubo");
