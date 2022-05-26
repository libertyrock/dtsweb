<?php
//shell_exec("pkill mpv");
$obj->command=["keypress","q"];
$json=json_encode($obj);
$resultado=exec("echo '".$json."' | socat - /tmp/tubo");
error_log($resultado);
