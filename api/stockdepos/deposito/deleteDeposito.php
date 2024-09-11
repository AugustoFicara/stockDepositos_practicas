<?php

include('Respuesta.php');
include_once('./stockdepos/db/dbDeposito.php');
header('Access-Control-Allow-Origin: *');

$ch = curl_init();
$body = file_get_contents("php://input");
$datos = json_decode($body, true);

$Deposito = new dbDeposito();

$Deposito->deleteDeposito($datos["id"], $datos["activo"]);

class DatosDepositos
{
	public $WebService;
	public $Version;
	public $Recurso;
	public $Descripcion;
	public $Domicilio;

	function __construct($Descripcion, $Domicilio)
	{
		$this->WebService = "MRphpServices";
		$this->Version = "2.0.0";
		$this->Recurso = "Stock";
		$this->Descripcion = $Descripcion;
		$this->Domicilio = $Domicilio;
	}
}
?>