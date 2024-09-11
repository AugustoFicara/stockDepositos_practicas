<?php
include('Respuesta.php');
include_once('./stockdepos/db/dbDestinatario.php');
header('Access-Control-Allow-Origin: *');

$ch = curl_init();
$body = file_get_contents("php://input");
$datos = json_decode($body, true);

$Destinatario = new dbDestinatario();

$Destinatario->deleteDestinatario($datos["id"], $datos["activo"]);

class DatosDestinatarios
{
	public $WebService;
	public $Version;
	public $Recurso;
	public $nombreCompleto;
	public $CUIT;
	public $domicilio;
	public $nroTelefono;
	public $email;

	function __construct($nombreCompleto, $CUIT, $nroTelefono, $email, $domicilio)
	{
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