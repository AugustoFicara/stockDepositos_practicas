<?php

include('./Respuesta.php');
include_once('./stockdepos/db/dbStock.php');
header('Access-Control-Allow-Origin: *');

$buscarTodos = 0;
$buscarActivos = 3;

if ($buscarActivos == getallheaders()['buscar']) {
    $Respuesta = new Respuesta();
    $Stock = new dbStock();
    $Stock->getStockActivos();
} else if ($buscarTodos == getallheaders()['buscar']) {
    $Respuesta = new Respuesta();
    $Stock = new dbStock();
    $Stock->getStock();
}



?>