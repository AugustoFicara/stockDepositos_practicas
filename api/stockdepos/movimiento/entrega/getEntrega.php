<?php

include('./Respuesta.php');
include_once('./stockdepos/db/movimiento/dbEntrega.php');
header('Access-Control-Allow-Origin: *');


$Respuesta = new Respuesta();
$Entrega = new dbEntrega();
$Entrega->getEntregas();

class DatosEntregas
{
    public $WebService;
    public $Version;
    public $Recurso;
    private $cantidadEntrega;
    private $fechaHoraEntrega;
    private $observaciones;
    private $id_destinatario;
    private $id_usuario;
    private $id_deposito;
    private $id_stock;

    function __construct($cantidadEntrega, $fechaHoraEntrega, $observaciones, $id_destinatario, $id_usuario, $id_deposito, $id_stock)
    {
        $this->WebService = "MRphpServices";
        $this->Version = "2.0.0";
        $this->Recurso = "Stock Depósitos - Destinatarios";
        $this->cantidadEntrega = $cantidadEntrega;
        $this->fechaHoraEntrega = $fechaHoraEntrega;
        $this->observaciones = $observaciones;
        $this->id_destinatario = $id_destinatario;
        $this->id_usuario = $id_usuario;
        $this->id_deposito = $id_deposito;
        $this->id_stock = $id_stock;
    }
}
?>