<?php

include('./Respuesta.php');
include_once('./stockdepos/db/dbDeposito.php');
header('Access-Control-Allow-Origin: *');
$activo = 1;

if ($activo == getallheaders()['activo']) {
    $deposito = new dbDeposito();
    $deposito->getDepositosActivos();
} else {
    $deposito = new dbDeposito();
    $deposito->getDepositos();
}


?>