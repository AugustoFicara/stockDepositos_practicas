<?php

include('./Respuesta.php');
include_once('./stockdepos/db/dbProveedor.php');
header('Access-Control-Allow-Origin: *');

$buscarCuit = 1;
$buscarEmail = 2;

if ($buscarCuit == getallheaders()['buscar']) {
    $Respuesta = new Respuesta();
    $Proveedor = new dbProveedor();
    $Proveedor->buscarCUIT(getallheaders()['id']);
} else if ($buscarEmail == getallheaders()['buscar']) {
    $Respuesta = new Respuesta();
    $Proveedor = new dbProveedor();
    $Proveedor->buscarEmail(getallheaders()['id']);
} else {
    $Respuesta = new Respuesta();
    $Proveedor = new dbProveedor();
    $Proveedor->getProveedores();
}

class DatosProveedores{
    public $WebService;
    public $Version;
    public $Recurso;
    public $nombreCompleto;
    public $CUIT;
    public $domicilio;
    public $nroTelefono;
    public $email;

    function __construct($nombreCompleto, $CUIT, $nroTelefono, $email, $domicilio){
        $this->WebService = "MRphpServices";
        $this->Version = "2.0.0";
        $this->Recurso = "Stock Depósitos - Proveedores";
        $this->nombreCompleto = $nombreCompleto;
        $this->domicilio = $domicilio;
        $this->CUIT = $CUIT;
        $this->nroTelefono = $nroTelefono;
        $this->email = $email;
    }
}

?>