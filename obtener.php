<?php
$entrada=json_decode(file_get_contents("playing"));
echo $entrada->name;
