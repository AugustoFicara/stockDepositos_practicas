<?php

include('./Respuesta.php');
include_once('./stockdepos/db/dbMaterial.php');
header('Access-Control-Allow-Origin: *');

$buscarTodos = 0;
$buscar = 1;
$buscarActivos = 2;
$buscarStock = 3;

if ($buscar == getallheaders()['buscar']) {
    $Respuesta = new Respuesta();
    $Material = new dbMaterial();
    $Material->buscarNombreMaterial(getallheaders()['id']);
} else if ($buscarTodos == getallheaders()['buscar']){
    $Respuesta = new Respuesta();
    $Material = new dbMaterial();
    $Material->getMateriales();
} else if($buscarActivos == getallheaders()['buscar']){
    $Respuesta = new Respuesta();
    $Material = new dbMaterial();
    $Material->getMaterialesActivos();
} else if($buscarStock == getallheaders()['buscar']){
    $Respuesta = new Respuesta();
    $Material = new dbMaterial();
    $Material->getMaterialesActivosStock();
}


?>