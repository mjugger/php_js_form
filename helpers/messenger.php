<?php 
include '../classes/controller.php';
$controller = new controller();
$jsonResponce = $controller->sendToDatabase($_POST);
echo $jsonResponce;
?>