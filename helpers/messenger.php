<?php 
include '../classes/controller.php';
$controller = new controller();
$test = $controller->sendToDatabase($_POST);
echo $test;
?>