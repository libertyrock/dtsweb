<?php
//file_put_contents("tubo","cycle pause\n");
$obj->command=["cycle","pause"];
$json=json_encode($obj);
$resultado=exec("echo '".$json."' | socat - /tmp/tubo");
echo($resultado);
