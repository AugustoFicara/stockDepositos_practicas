<?php

include('./Respuesta.php');
include_once('./stockdepos/db/dbDestinatario.php');
header('Access-Control-Allow-Origin: *');

$buscarCuit = 1;
$buscarEmail = 2;

if ($buscarCuit == getallheaders()['buscar']) {
    $Respuesta = new Respuesta();
    $Destinatario = new dbDestinatario();
    $Destinatario->buscarCUIT(getallheaders()['id']);
} else if ($buscarEmail == getallheaders()['buscar']) {
    $Respuesta = new Respuesta();
    $Destinatario = new dbDestinatario();
    $Destinatario->buscarEmail(getallheaders()['id']);
} else {
    $Respuesta = new Respuesta();
    $Destinatario = new dbDestinatario();
    $Destinatario->getDestinatarios();
}

class DatosDestinatarios{
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
        $this->Recurso = "Stock Depósitos - Destinatarios";
        $this->nombreCompleto = $nombreCompleto;
        $this->domicilio = $domicilio;
        $this->CUIT = $CUIT;
        $this->nroTelefono = $nroTelefono;
        $this->email = $email;
    }
}

?>