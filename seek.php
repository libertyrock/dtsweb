<?php
$seconds=$_POST["seconds"];
file_put_contents("tubo","seek $seconds absolute+keyframes\n");
